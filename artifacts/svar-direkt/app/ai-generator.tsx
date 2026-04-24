import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { getDeviceId } from "@/services/deviceId";

const AI_BACKEND = "https://lightgoldenrodyellow-zebra-953586.hostingersite.com";
const AI_LIMIT = 10;

const CASE_TYPES: Record<string, string[]> = {
  Skatteverket: ["Felaktig debitering", "Ändring av folkbokföring", "Deklarationsfråga", "Överklagande av beslut", "Begära anstånd", "Annat"],
  Kronofogden: ["Bestrida skuld", "Begära skuldsanering", "Fråga om utmätning", "Begära betalningsplan", "Invändning mot betalningsföreläggande", "Annat"],
  Försäkringskassan: ["Sjukpenning nekad", "Föräldrapenning", "Handläggning tar för lång tid", "Överklaga beslut", "Begära omprövning", "Aktivitetsersättning", "Annat"],
  Migrationsverket: ["Uppehållstillstånd", "Medborgarskap", "Asylansökan", "Förlängning av tillstånd", "Arbetstillstånd", "Annat"],
  Arbetsförmedlingen: ["A-kassa nekad", "Aktivitetsrapport", "Överklagande", "Fråga om åtgärder", "Annat"],
  Inkasso: ["Bestrida inkassokrav", "Begära specificering av skuld", "Begära betalningsplan", "Preskriberad skuld", "Felaktigt krav", "Annat"],
  Socialtjänsten: ["Ekonomiskt bistånd", "Överklagande av beslut", "Begära utredning", "Barnomsorg", "Annat"],
  Boverket: ["Bostadsbidrag", "Överklagande", "Fråga om bidrag", "Annat"],
  "Annan myndighet": ["Överklagande av beslut", "Begära information", "Klagomål", "Allmän förfrågan", "Annat"],
};

const INSTITUTIONS = Object.keys(CASE_TYPES);

const ERROR_MSG = "AI-tjänsten är tillfälligt otillgänglig. Försök igen senare.";

interface PickerProps {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onSelect: (val: string) => void;
  theme: typeof Colors.light;
  disabled?: boolean;
}

function InlinePicker({ label, value, options, placeholder, onSelect, theme, disabled }: PickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label} *</Text>
      <Pressable
        onPress={() => !disabled && setOpen((o) => !o)}
        style={[
          styles.pickerBtn,
          {
            backgroundColor: theme.card,
            borderColor: open ? Colors.primary : theme.cardBorder,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Text style={[styles.pickerBtnText, { color: value ? theme.text : theme.textTertiary }]}>
          {value || placeholder}
        </Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={18} color={theme.textTertiary} />
      </Pressable>
      {open && (
        <View style={[styles.pickerDropdown, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => { onSelect(opt); setOpen(false); }}
              style={({ pressed }) => [
                styles.pickerOption,
                { backgroundColor: pressed ? Colors.primary + "12" : "transparent" },
                opt === value && { backgroundColor: Colors.primary + "18" },
              ]}
            >
              <Text style={[styles.pickerOptionText, { color: opt === value ? Colors.primary : theme.text }]}>
                {opt}
              </Text>
              {opt === value && <Feather name="check" size={15} color={Colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function AiGeneratorScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState("");
  const [personnummer, setPersonnummer] = useState("");
  const [institution, setInstitution] = useState("");
  const [caseType, setCaseType] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Warm-up ping
    fetch(`${AI_BACKEND}/test`).catch(() => {});
  }, []);

  const handleInstitutionChange = useCallback((val: string) => {
    setInstitution(val);
    setCaseType("");
  }, []);

  const canSubmit =
    fullName.trim().length > 0 &&
    personnummer.trim().length > 0 &&
    institution.length > 0 &&
    caseType.length > 0 &&
    description.trim().length >= 20 &&
    !loading;

  const handleGenerate = async () => {
    if (!canSubmit) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError("");
    setResult("");

    const userId = await getDeviceId();

    const message =
      `Skriv ett formellt brev på svenska från ${fullName.trim()} (personnummer: ${personnummer.trim()}) till ${institution} angående ärendet: ${caseType}.\n\nBakgrund och situation:\n${description.trim()}\n\nBrevet ska vara professionellt, kortfattat och tydligt.`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(`${AI_BACKEND}/api/ai/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, userId }),
        });

        if (res.status === 503 || res.status === 502 || res.status === 504) {
          if (attempt < 2) {
            setError("Servern startar... försöker igen");
            await new Promise((r) => setTimeout(r, 3000));
            setError("");
            continue;
          }
          setError(ERROR_MSG);
          break;
        }

        if (res.status === 429) {
          setError("Du har använt alla 10 genereringar idag — återställs imorgon.");
          break;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError((data as any)?.error || ERROR_MSG);
          break;
        }

        const data = await res.json() as { reply: string; remaining?: number };
        setResult(data.reply);
        if (typeof data.remaining === "number") {
          setRemaining(data.remaining);
        }
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
        setLoading(false);
        return;
      } catch {
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        setError(ERROR_MSG);
      }
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setLoading(false);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(result);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const remainingLabel = remaining !== null
    ? `${remaining}/${AI_LIMIT} genereringar kvar idag`
    : `Max ${AI_LIMIT} genereringar per dag`;

  const remainingOut = remaining !== null ? remaining === 0 : false;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingTop: topPad + 12, paddingBottom: bottomPad + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Feather name="arrow-left" size={20} color={theme.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>✨ AI-Myndighetsbrev</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Generera ett formellt brev på sekunder
            </Text>
          </View>
        </View>

        {/* Usage banner */}
        <View style={[
          styles.usageBanner,
          {
            backgroundColor: remainingOut ? theme.card : Colors.primary + "12",
            borderColor: remainingOut ? theme.cardBorder : Colors.primary + "30",
          }
        ]}>
          <Feather name="zap" size={16} color={remainingOut ? theme.textTertiary : Colors.primary} />
          <Text style={[styles.usageText, { color: remainingOut ? theme.textTertiary : Colors.primary }]}>
            {remainingLabel}
          </Text>
        </View>

        {/* Form */}
        <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.formSection, { color: theme.textSecondary }]}>DINA UPPGIFTER</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Fullständigt namn *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.text }]}
            placeholder="Anna Svensson"
            placeholderTextColor={theme.textTertiary}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Personnummer *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.text }]}
            placeholder="ÅÅMMDD-XXXX"
            placeholderTextColor={theme.textTertiary}
            value={personnummer}
            onChangeText={setPersonnummer}
            keyboardType="numbers-and-punctuation"
          />

          <Text style={[styles.formSection, { color: theme.textSecondary, marginTop: 8 }]}>ÄRENDET</Text>

          <InlinePicker
            label="Myndighet / mottagare"
            value={institution}
            options={INSTITUTIONS}
            placeholder="Välj myndighet..."
            onSelect={handleInstitutionChange}
            theme={theme}
          />

          <InlinePicker
            label="Ärendetyp"
            value={caseType}
            options={institution ? CASE_TYPES[institution] ?? [] : []}
            placeholder={institution ? "Välj ärendetyp..." : "Välj myndighet först..."}
            onSelect={setCaseType}
            theme={theme}
            disabled={!institution}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Beskriv ditt problem *</Text>
          <TextInput
            style={[
              styles.input,
              styles.textarea,
              { backgroundColor: theme.background, borderColor: theme.cardBorder, color: theme.text },
            ]}
            placeholder="Beskriv din situation kortfattat — vad har hänt, vad du begär och viktig information (minst 20 tecken)..."
            placeholderTextColor={theme.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: description.length < 20 ? theme.textTertiary : theme.success }]}>
            {description.length} tecken {description.length < 20 ? `(minst 20)` : "✓"}
          </Text>
        </View>

        {/* Error */}
        {error !== "" && (
          <View style={[styles.errorBox, { backgroundColor: theme.danger + "12", borderColor: theme.danger + "30" }]}>
            <Feather name="alert-circle" size={15} color={theme.danger} />
            <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
          </View>
        )}

        {/* Generate button */}
        <Pressable
          onPress={handleGenerate}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.generateBtn,
            { backgroundColor: canSubmit ? Colors.primary : Colors.primary + "50", opacity: pressed ? 0.85 : 1 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Feather name="zap" size={18} color="#fff" />
              <Text style={styles.generateBtnText}>Generera brev</Text>
            </>
          )}
        </Pressable>

        {/* Result */}
        {result !== "" && (
          <View style={[styles.resultCard, { backgroundColor: theme.card, borderColor: Colors.primary + "40" }]}>
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleRow}>
                <Feather name="file-text" size={16} color={Colors.primary} />
                <Text style={[styles.resultTitle, { color: Colors.primary }]}>Genererat brev</Text>
              </View>
              <Pressable
                onPress={handleCopy}
                style={[styles.copyBtn, { backgroundColor: copied ? theme.success + "15" : Colors.primary + "15" }]}
              >
                <Feather name={copied ? "check" : "copy"} size={15} color={copied ? theme.success : Colors.primary} />
                <Text style={[styles.copyBtnText, { color: copied ? theme.success : Colors.primary }]}>
                  {copied ? "Kopierat!" : "Kopiera"}
                </Text>
              </Pressable>
            </View>
            <View style={[styles.resultDivider, { backgroundColor: theme.separator }]} />
            <Text style={[styles.resultText, { color: theme.text }]}>{result}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },

  usageBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  usageText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },

  formCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 12,
  },
  formSection: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 6,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 13,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  textarea: {
    minHeight: 110,
    paddingTop: 11,
  },
  charCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: -10,
    marginBottom: 4,
    textAlign: "right",
  },

  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 13,
    marginBottom: 4,
  },
  pickerBtnText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  pickerDropdown: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pickerOptionText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
    lineHeight: 18,
  },

  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginBottom: 20,
  },
  generateBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },

  resultCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  copyBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  resultDivider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 14,
  },
  resultText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
});
