import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
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
import { APP_CONFIG } from "@/constants/config";
import { useAuth } from "@/contexts/AuthContext";
import { getDeviceId } from "@/services/deviceId";

const CASE_TYPES = [
  "Hyreskonflikt",
  "Inkasso / skuld",
  "Klagomål",
  "Obefogat krav",
  "Inget svar",
  "Avhysning",
  "Arbetsrättslig tvist",
  "Försäkringsärende",
  "Myndighetsärende",
  "Felaktig faktura",
  "Skadeersättning",
  "Övrigt",
];

const TONES = [
  { id: "formell", label: "Formell" },
  { id: "assertiv", label: "Bestämd" },
  { id: "kortfattad", label: "Kortfattad" },
  { id: "detaljerad", label: "Detaljerad" },
] as const;

const LENGTHS = [
  { id: "kort", label: "Kort" },
  { id: "standard", label: "Standard" },
  { id: "detaljerat", label: "Detaljerat" },
] as const;

type Tone = (typeof TONES)[number]["id"];
type Length = (typeof LENGTHS)[number]["id"];

interface UsageInfo {
  used: number;
  remaining: number;
  limit: number;
}

function Chip({
  label,
  selected,
  onPress,
  theme,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: typeof Colors.light;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? Colors.primary : theme.card,
          borderColor: selected ? Colors.primary : theme.cardBorder,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          {
            color: selected ? "#fff" : theme.textSecondary,
            fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function UsageBadge({ usage, theme }: { usage: UsageInfo | null; theme: typeof Colors.light }) {
  if (!usage) return null;
  const isEmpty = usage.remaining === 0;
  const color = isEmpty ? "#d63031" : usage.remaining === 1 ? "#e17055" : Colors.primary;
  return (
    <View style={[styles.usageBadge, { backgroundColor: color + "18", borderColor: color + "35" }]}>
      <Feather name="cpu" size={13} color={color} />
      <Text style={[styles.usageText, { color, fontFamily: "Inter_600SemiBold" }]}>
        {isEmpty
          ? "Dagsgräns nådd"
          : `${usage.remaining} av ${usage.limit} kvar idag`}
      </Text>
    </View>
  );
}

export default function AiComposeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const { isAuthenticated, token } = useAuth();

  const [institution, setInstitution] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState<string | null>(null);
  const [situation, setSituation] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState<Tone>("formell");
  const [length, setLength] = useState<Length>("standard");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    institution.trim().length > 0 &&
    selectedCaseType !== null &&
    situation.trim().length >= 10 &&
    goal.trim().length >= 5;

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const apiBase = APP_CONFIG.apiBaseUrl;
    if (!apiBase) return;
    fetch(`${apiBase}/ai/usage`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.used !== undefined) {
          setUsage({ used: d.used, remaining: d.remaining, limit: d.limit });
        }
      })
      .catch(() => {});
  }, [isAuthenticated, token]);

  const handleGenerate = async () => {
    if (!isValid || loading) return;

    const apiBase = APP_CONFIG.apiBaseUrl;
    if (!apiBase) {
      Alert.alert("Konfigurationsfel", "API-adressen är inte konfigurerad. Kontakta support.");
      return;
    }
    if (!token) {
      Alert.alert("Ej inloggad", "Du måste logga in för att använda AI-assistenten.");
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const deviceId = await getDeviceId();

      const resp = await fetch(`${apiBase}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deviceId,
          institution: institution.trim(),
          caseType: selectedCaseType,
          situation: situation.trim(),
          goal: goal.trim(),
          tone,
          length,
        }),
      });

      const data = await resp.json();

      if (resp.status === 429) {
        setUsage({ used: data.used ?? 4, remaining: 0, limit: data.limit ?? 4 });
        setError(data.message ?? "Du har använt alla dina AI-generationer för idag. Prova igen imorgon.");
        return;
      }

      if (!resp.ok) {
        throw new Error(data.error ?? `Serverfel (${resp.status})`);
      }

      setResult(data.message);
      setUsage({ used: data.used, remaining: data.remaining, limit: data.limit });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kontrollera din anslutning och försök igen.";
      setError(`Kunde inte generera meddelandet: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await Clipboard.setStringAsync(result);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    if (!result) return;
    const subject = encodeURIComponent(`Ärende – ${selectedCaseType ?? "begäran"}`);
    const body = encodeURIComponent(result);
    Linking.openURL(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setInstitution("");
    setSelectedCaseType(null);
    setSituation("");
    setGoal("");
    setTone("formell");
    setLength("standard");
    setCopied(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 8, paddingBottom: 60 }]}
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
        <View style={styles.headerCenter}>
          <View style={[styles.headerIcon, { backgroundColor: Colors.primary + "18" }]}>
            <Feather name="cpu" size={18} color={Colors.primary} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
            AI-Assistent
          </Text>
        </View>
        {result && (
          <Pressable
            onPress={handleReset}
            style={[styles.resetBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Feather name="refresh-cw" size={18} color={theme.textSecondary} />
          </Pressable>
        )}
        {!result && <View style={{ width: 40 }} />}
      </View>

      {/* Auth gate — shown if not logged in */}
      {!isAuthenticated ? (
        <View style={[styles.authGate, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={[styles.authGateIcon, { backgroundColor: Colors.primary + "18" }]}>
            <Feather name="lock" size={32} color={Colors.primary} />
          </View>
          <Text style={[styles.authGateTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
            Logga in för att fortsätta
          </Text>
          <Text style={[styles.authGateText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            AI-assistenten kräver ett konto. Gratis att skapa – du får 4 AI-generationer per dag.
          </Text>
          <Pressable
            onPress={() => router.push("/login")}
            style={({ pressed }) => [styles.authGateBtn, { backgroundColor: Colors.primary, opacity: pressed ? 0.88 : 1 }]}
          >
            <Feather name="log-in" size={18} color="#fff" />
            <Text style={[styles.authGateBtnText, { fontFamily: "Inter_600SemiBold" }]}>Logga in</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={[styles.authGateSecondary, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
              Inget konto? Skapa ett gratis konto →
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
      {/* Subtitle + usage */}
      <View style={styles.subtitleRow}>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Generera formella brev till myndigheter, hyresvärdar, inkassobolag och mer.
        </Text>
        <UsageBadge usage={usage} theme={theme} />
      </View>

      {/* Limit info */}
      {!usage && (
        <View style={[styles.infoBox, { backgroundColor: Colors.primary + "10", borderColor: Colors.primary + "25" }]}>
          <Feather name="info" size={14} color={Colors.primary} />
          <Text style={[styles.infoText, { color: Colors.primary, fontFamily: "Inter_400Regular" }]}>
            4 AI-generationer per dag. Varje meddelande är unikt och skräddarsytt för din situation.
          </Text>
        </View>
      )}

      {/* RESULT VIEW */}
      {result ? (
        <View style={styles.resultSection}>
          <View style={[styles.resultBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={[styles.resultHeader, { borderBottomColor: theme.cardBorder }]}>
              <Feather name="file-text" size={16} color={Colors.primary} />
              <Text style={[styles.resultHeaderText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                Genererat meddelande
              </Text>
            </View>
            <Text style={[styles.resultText, { color: theme.text, fontFamily: "Inter_400Regular" }]}>
              {result}
            </Text>
          </View>

          <Pressable
            onPress={handleCopy}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: copied ? "#00b894" : Colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Feather name={copied ? "check" : "copy"} size={20} color="#fff" />
            <Text style={[styles.primaryBtnText, { fontFamily: "Inter_600SemiBold" }]}>
              {copied ? "Kopierat!" : "Kopiera meddelande"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleEmail}
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather name="mail" size={18} color={Colors.primary} />
            <Text style={[styles.secondaryBtnText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
              Skicka via e-post
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* FORM */}
          <View style={styles.formSection}>
            {/* Institution */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
                MOTTAGARE / INSTITUTION *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text, fontFamily: "Inter_400Regular" },
                ]}
                placeholder="T.ex. Kronofogden, Min hyresvärd AB, Inkasso Sverige..."
                placeholderTextColor={theme.textTertiary}
                value={institution}
                onChangeText={setInstitution}
                returnKeyType="next"
              />
            </View>

            {/* Case type */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
                ÄRENDETYP *
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {CASE_TYPES.map((ct) => (
                  <Chip
                    key={ct}
                    label={ct}
                    selected={selectedCaseType === ct}
                    onPress={() => setSelectedCaseType(ct === selectedCaseType ? null : ct)}
                    theme={theme}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Situation */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
                BESKRIV SITUATIONEN * ({situation.trim().length}/2000)
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text, fontFamily: "Inter_400Regular" },
                ]}
                placeholder="Beskriv vad som har hänt, relevant bakgrund, och viktig information som bör finnas med i meddelandet..."
                placeholderTextColor={theme.textTertiary}
                value={situation}
                onChangeText={(t) => setSituation(t.slice(0, 2000))}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* Goal */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
                VAD VILL DU UPPNÅ? *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text, fontFamily: "Inter_400Regular" },
                ]}
                placeholder="T.ex. Få skulden struken, kräva svar, begära information..."
                placeholderTextColor={theme.textTertiary}
                value={goal}
                onChangeText={(t) => setGoal(t.slice(0, 500))}
                returnKeyType="done"
              />
            </View>

            {/* Tone */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
                TON
              </Text>
              <View style={styles.chipRow}>
                {TONES.map((t) => (
                  <Chip
                    key={t.id}
                    label={t.label}
                    selected={tone === t.id}
                    onPress={() => setTone(t.id)}
                    theme={theme}
                  />
                ))}
              </View>
            </View>

            {/* Length */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
                LÄNGD
              </Text>
              <View style={styles.chipRow}>
                {LENGTHS.map((l) => (
                  <Chip
                    key={l.id}
                    label={l.label}
                    selected={length === l.id}
                    onPress={() => setLength(l.id)}
                    theme={theme}
                  />
                ))}
              </View>
            </View>

            {/* Validation hint */}
            {!isValid && (institution.length > 0 || selectedCaseType || situation.length > 0) && (
              <Text style={[styles.hintText, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
                Fyll i alla obligatoriska fält (*). Situationen behöver minst 10 tecken.
              </Text>
            )}

            {/* Inline error banner */}
            {error && (
              <View style={[styles.errorBanner, { backgroundColor: "#fff0f0", borderColor: "#e53e3e33" }]}>
                <Feather name="alert-circle" size={15} color="#e53e3e" />
                <Text style={[styles.errorBannerText, { color: "#c0392b", fontFamily: "Inter_400Regular" }]}>
                  {error}
                </Text>
              </View>
            )}

            {/* Generate button */}
            <Pressable
              onPress={handleGenerate}
              disabled={!isValid || loading}
              style={({ pressed }) => [
                styles.generateBtn,
                {
                  backgroundColor: isValid && !loading ? Colors.primary : theme.card,
                  borderColor: isValid && !loading ? Colors.primary : theme.cardBorder,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color={isValid ? "#fff" : theme.textSecondary} />
                  <Text
                    style={[
                      styles.generateBtnText,
                      {
                        color: isValid ? "#fff" : theme.textSecondary,
                        fontFamily: "Inter_600SemiBold",
                      },
                    ]}
                  >
                    Genererar…
                  </Text>
                </>
              ) : (
                <>
                  <Feather name="cpu" size={20} color={isValid ? "#fff" : theme.textTertiary} />
                  <Text
                    style={[
                      styles.generateBtnText,
                      {
                        color: isValid ? "#fff" : theme.textTertiary,
                        fontFamily: "Inter_600SemiBold",
                      },
                    ]}
                  >
                    Generera meddelande
                  </Text>
                </>
              )}
            </Pressable>

            {/* Footer note */}
            <Text style={[styles.footerNote, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
              AI:n skriver på formell svenska och fabricerar inga lagar. Granska alltid meddelandet innan du skickar.
            </Text>
          </View>
        </>
      )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
  },
  resetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },

  subtitleRow: { gap: 10, marginBottom: 14 },
  subtitle: { fontSize: 13, lineHeight: 19 },

  usageBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  usageText: { fontSize: 12 },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
  infoText: { fontSize: 12, lineHeight: 17, flex: 1 },

  formSection: { gap: 0 },
  field: { marginBottom: 20 },
  label: {
    fontSize: 11,
    letterSpacing: 0.6,
    marginBottom: 8,
  },

  textInput: {
    height: 50,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  textArea: {
    minHeight: 120,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: { fontSize: 13 },

  hintText: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
    marginTop: -8,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  errorBannerText: { fontSize: 13, lineHeight: 18, flex: 1 },

  generateBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  generateBtnText: { fontSize: 16 },

  footerNote: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 8,
  },

  resultSection: { gap: 12 },
  resultBox: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    marginBottom: 4,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  resultHeaderText: { fontSize: 13 },
  resultText: {
    fontSize: 15,
    lineHeight: 24,
    padding: 16,
  },

  primaryBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryBtnText: { fontSize: 16, color: "#fff" },

  secondaryBtn: {
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  secondaryBtnText: { fontSize: 15 },

  authGate: {
    marginTop: 24,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 28,
    alignItems: "center",
    gap: 14,
  },
  authGateIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  authGateTitle: { fontSize: 20, textAlign: "center" },
  authGateText: { fontSize: 14, textAlign: "center", lineHeight: 21 },
  authGateBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  authGateBtnText: { color: "#fff", fontSize: 16 },
  authGateSecondary: { fontSize: 14, marginTop: 4 },
});
