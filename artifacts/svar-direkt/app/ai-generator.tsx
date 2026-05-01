import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/colors";
import { PremiumGate } from "@/components/PremiumGate";
import { askAi, API_BASE, ApiError } from "@/services/api";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

const DISCLAIMER_KEY = "ai_disclaimer_accepted_v1";
const AI_LIMIT = 10;
const FREE_LIMIT = 3;

const CYAN = "#1a9ecf";
const CYAN_DIM = "#0a7ea4";
const DARK_BG = "#060e17";
const CARD_BG = "#0d1e2d";
const CARD_BORDER = "#1a3a50";
const TEXT = "#e8f4f8";
const TEXT_SEC = "#6a90a8";
const TEXT_TER = "#3a5568";
const DANGER = "#ff5a5a";
const SUCCESS = "#4ade80";

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

function usePulse(active = true) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) { anim.setValue(0); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active]);
  return anim;
}

function useRotate() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
}

const DOT_CONFIGS = [
  { top: 60, left: 30, right: undefined, size: 2, opacity: 0.4, delay: 0 },
  { top: 120, left: undefined, right: 40, size: 1.5, opacity: 0.3, delay: 500 },
  { top: 200, left: 80, right: undefined, size: 2.5, opacity: 0.25, delay: 1000 },
  { top: 300, left: undefined, right: 60, size: 1.5, opacity: 0.35, delay: 700 },
  { top: 400, left: 20, right: undefined, size: 2, opacity: 0.2, delay: 300 },
];

function GlowDot({ cfg }: { cfg: typeof DOT_CONFIGS[0] }) {
  const a = useRef(new Animated.Value(cfg.opacity)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: cfg.opacity * 0.2, duration: 2200, delay: cfg.delay, useNativeDriver: true }),
        Animated.timing(a, { toValue: cfg.opacity, duration: 2200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View style={{
      position: "absolute", top: cfg.top, left: cfg.left, right: cfg.right,
      width: cfg.size * 2, height: cfg.size * 2, borderRadius: cfg.size,
      backgroundColor: CYAN, opacity: a,
    }} pointerEvents="none" />
  );
}

function GlowDots() {
  return (
    <>
      {DOT_CONFIGS.map((d, i) => <GlowDot key={i} cfg={d} />)}
    </>
  );
}

interface PickerProps {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onSelect: (val: string) => void;
  disabled?: boolean;
}

function FuturePicker({ label, value, options, placeholder, onSelect, disabled }: PickerProps) {
  const [open, setOpen] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const animBorder = (toValue: number) => {
    Animated.timing(borderAnim, { toValue, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_BORDER, CYAN],
  });

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.fuLabel}>{label}</Text>
      <Animated.View style={[styles.fuPickerWrap, { borderColor }]}>
        <Pressable
          onPress={() => {
            if (disabled) return;
            const next = !open;
            setOpen(next);
            animBorder(next ? 1 : 0);
          }}
          style={styles.fuPickerBtn}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
            {value ? <View style={styles.fuPickerDot} /> : null}
            <Text style={[styles.fuPickerText, { color: value ? TEXT : TEXT_TER, opacity: disabled ? 0.4 : 1 }]}>
              {value || placeholder}
            </Text>
          </View>
          <View style={[styles.fuChevronWrap, open && { backgroundColor: CYAN + "25", borderColor: CYAN + "60" }]}>
            <Feather name={open ? "chevron-up" : "chevron-down"} size={14} color={open ? CYAN : TEXT_TER} />
          </View>
        </Pressable>
      </Animated.View>
      {open && (
        <View style={styles.fuDropdown}>
          {options.map((opt, i) => (
            <Pressable
              key={opt}
              onPress={() => { onSelect(opt); setOpen(false); animBorder(0); }}
              style={[
                styles.fuDropdownItem,
                i < options.length - 1 && styles.fuDropdownSep,
                opt === value && { backgroundColor: CYAN + "15" },
              ]}
            >
              <View style={[styles.fuDropdownBullet, opt === value && { backgroundColor: CYAN }]} />
              <Text style={[styles.fuDropdownText, { color: opt === value ? CYAN : TEXT }]}>{opt}</Text>
              {opt === value && <Feather name="check" size={13} color={CYAN} />}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function FutureInput({
  label, value, onChange, placeholder, multiline, keyboardType, autoCapitalize,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; multiline?: boolean; keyboardType?: any; autoCapitalize?: any;
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const animBorder = (v: number) =>
    Animated.timing(borderAnim, { toValue: v, duration: 220, useNativeDriver: false }).start();
  const borderColor = borderAnim.interpolate({ inputRange: [0, 1], outputRange: [CARD_BORDER, CYAN] });

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.fuLabel}>{label}</Text>
      <Animated.View style={[styles.fuInputWrap, multiline && { height: 110 }, { borderColor }]}>
        {focused && <View style={styles.fuInputGlow} pointerEvents="none" />}
        <TextInput
          style={[styles.fuInput, multiline && { flex: 1, height: "100%", textAlignVertical: "top", paddingTop: 12 }]}
          placeholder={placeholder}
          placeholderTextColor={TEXT_TER}
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "sentences"}
          onFocus={() => { setFocused(true); animBorder(1); }}
          onBlur={() => { setFocused(false); animBorder(0); }}
        />
      </Animated.View>
    </View>
  );
}

function AiGeneratorScreenInner() {
  const insets = useSafeAreaInsets();
  const { addAiConversation } = useApp();
  const { user, isPremium } = useAuth();

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
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const pulseAnim = usePulse(loading);
  const rotateAnim = useRotate();
  const orbitAnim = usePulse(true);

  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetch(`${API_BASE}/test`).catch(() => {});
    AsyncStorage.getItem(DISCLAIMER_KEY).then((v) => { if (!v) setShowDisclaimer(true); });
  }, []);

  const acceptDisclaimer = useCallback(async () => {
    await AsyncStorage.setItem(DISCLAIMER_KEY, "1");
    setShowDisclaimer(false);
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
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    setLoading(true); setError(""); setResult("");

    const message = `Skriv ETT formellt brev på svenska från ${fullName.trim()} (personnummer: ${personnummer.trim()}) till ${institution} angående ärendet: ${caseType}.\n\nBakgrund och situation:\n${description.trim()}\n\nKrav: Returnera ENBART brevtexten på svenska. Inga förklaringar, inga kommentarer, ingen engelsk text. Börja direkt med avsändarens namn.`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const data = await askAi(message);
        setResult(data.reply);
        addAiConversation({ question: description.trim(), reply: data.reply, institution });
        if (typeof data.remaining === "number") setRemaining(data.remaining);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
        setLoading(false);
        return;
      } catch (err: any) {
        if (err instanceof ApiError) {
          if (err.status === 402 || err.code === "PREMIUM_REQUIRED") { setError("Prenumeration krävs."); setLoading(false); router.push("/paywall"); return; }
          if (err.status === 401) { setError("Sessionen har gått ut — logga in igen."); setLoading(false); router.push("/auth"); return; }
          if (err.status === 429) { setError("Du har använt alla 10 genereringar idag — återställs imorgon."); setLoading(false); return; }
          if (err.status === 503 || err.status === 502 || err.status === 504) {
            if (attempt < 2) { setError("Ansluter till AI-servern..."); await new Promise((r) => setTimeout(r, 3000)); setError(""); continue; }
            setError(ERROR_MSG); setLoading(false); return;
          }
          setError(err.message || ERROR_MSG); setLoading(false); return;
        }
        if (attempt < 2) { await new Promise((r) => setTimeout(r, 3000)); continue; }
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
    setTimeout(() => setCopied(false), 2400);
  };

  // For free users: track free letters (3 total); for premium: daily usage (10/day)
  const isFreeUser = !isPremium;
  const limit = isFreeUser ? FREE_LIMIT : AI_LIMIT;
  // Seed from user object, update from AI response
  const seedRemaining = isFreeUser
    ? (user?.freeLettersRemaining ?? FREE_LIMIT)
    : AI_LIMIT;
  const displayRemaining = remaining !== null ? remaining : seedRemaining;
  const progressPct = Math.max(0, Math.min(1, displayRemaining / limit));
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const glowOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });
  const orbitOpacity = orbitAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.45] });

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.flex}>
        {/* Background */}
        <LinearGradient
          colors={["#060e17", "#091623", "#060e17"]}
          style={StyleSheet.absoluteFill}
        />
        {/* Radial glow top */}
        <Animated.View style={[styles.bgGlowTop, { opacity: orbitOpacity }]} pointerEvents="none" />
        <Animated.View style={[styles.bgGlowBottom, { opacity: orbitAnim.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.15] }) }]} pointerEvents="none" />

        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingTop: topPad + 8, paddingBottom: bottomPad + 120 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <GlowDots />

          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Feather name="arrow-left" size={20} color={TEXT} />
            </Pressable>

            <View style={styles.aiIconWrap}>
              <Animated.View style={[styles.aiIconRing, { opacity: glowOpacity, transform: [{ rotate: rotateAnim }] }]} />
              <Animated.View style={[styles.aiIconRing2, { opacity: orbitOpacity }]} />
              <View style={styles.aiIconCore}>
                <Text style={styles.aiIconEmoji}>⚡</Text>
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.title}>AI-Myndighetsbrev</Text>
                <View style={styles.liveChip}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.subtitle}>Genererar professionella brev på sekunder</Text>
            </View>
          </View>

          {/* Usage meter */}
          <View style={styles.usageCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Feather name={isFreeUser ? "gift" : "zap"} size={14} color={CYAN} />
                <Text style={styles.usageLabel}>
                  {isFreeUser ? "Gratis brev" : "Dagliga genereringar"}
                </Text>
              </View>
              <Text style={[styles.usageCount, displayRemaining === 0 && { color: "#ff6b6b" }]}>
                {isFreeUser
                  ? `${displayRemaining}/${FREE_LIMIT} kvar`
                  : `${displayRemaining}/${AI_LIMIT} kvar`}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[styles.progressFill, { width: `${progressPct * 100}%` as any }]}
              />
              <View style={[styles.progressGlow, { width: `${progressPct * 100}%` as any }]} />
            </View>
            <Text style={styles.usageSub}>
              {isFreeUser
                ? `${FREE_LIMIT} gratis brev totalt · Prenumerera för obegränsad åtkomst`
                : `Max ${AI_LIMIT} per dag · återställs midnatt`}
            </Text>
          </View>

          {/* Section: User data */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLine} />
            <Text style={styles.sectionTitle}>DINA UPPGIFTER</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.formPanel}>
            <FutureInput label="Fullständigt namn" value={fullName} onChange={setFullName} placeholder="Anna Svensson" autoCapitalize="words" />
            <FutureInput label="Personnummer" value={personnummer} onChange={setPersonnummer} placeholder="ÅÅMMDD-XXXX" keyboardType="numbers-and-punctuation" autoCapitalize="none" />
          </View>

          {/* Section: Case */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLine} />
            <Text style={styles.sectionTitle}>ÄRENDET</Text>
            <View style={styles.sectionLine} />
          </View>

          <View style={styles.formPanel}>
            <FuturePicker
              label="Myndighet / mottagare"
              value={institution}
              options={INSTITUTIONS}
              placeholder="Välj myndighet..."
              onSelect={handleInstitutionChange}
            />
            <FuturePicker
              label="Ärendetyp"
              value={caseType}
              options={institution ? CASE_TYPES[institution] ?? [] : []}
              placeholder={institution ? "Välj ärendetyp..." : "Välj myndighet först..."}
              onSelect={setCaseType}
              disabled={!institution}
            />
            <FutureInput
              label="Beskriv din situation"
              value={description}
              onChange={setDescription}
              placeholder="Beskriv vad som har hänt, vad du begär och viktig information (minst 20 tecken)..."
              multiline
            />
            <Text style={[styles.charCount, { color: description.length < 20 ? TEXT_TER : SUCCESS }]}>
              {description.length} tecken {description.length < 20 ? `(minst 20)` : "✓"}
            </Text>
          </View>

          {/* Error */}
          {error !== "" && (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={15} color={DANGER} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Generate button */}
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <Pressable onPress={handleGenerate} disabled={!canSubmit}>
              <LinearGradient
                colors={canSubmit ? ["#0a7ea4", "#1a9ecf", "#0a7ea4"] : ["#0d2030", "#0d2030"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.generateBtn, !canSubmit && { opacity: 0.5 }]}
              >
                {loading ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.generateBtnText}>Genererar brev...</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={styles.btnIconWrap}>
                      <Feather name="zap" size={16} color="#fff" />
                    </View>
                    <Text style={styles.generateBtnText}>Generera brev med AI</Text>
                    <Feather name="arrow-right" size={16} color="rgba(255,255,255,0.7)" />
                  </View>
                )}
              </LinearGradient>
            </Pressable>
            {canSubmit && !loading && (
              <Animated.View style={[styles.btnGlowLine, { opacity: glowOpacity }]} pointerEvents="none" />
            )}
          </Animated.View>

          {/* Result */}
          {result !== "" && (
            <View style={styles.resultCard}>
              {/* Scanner line */}
              <View style={styles.resultHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={styles.resultDotGreen} />
                  <Text style={styles.resultTitle}>GENERERAT BREV</Text>
                </View>
                <Pressable onPress={handleCopy} style={[styles.copyBtn, copied && styles.copyBtnSuccess]}>
                  <Feather name={copied ? "check" : "copy"} size={14} color={copied ? "#060e17" : CYAN} />
                  <Text style={[styles.copyBtnText, copied && { color: "#060e17" }]}>
                    {copied ? "Kopierat!" : "Kopiera"}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.resultDivider} />
              <Text style={styles.resultText}>{result}</Text>

              <View style={styles.aiDisclaimer}>
                <Feather name="alert-triangle" size={13} color="#d69e2e" />
                <Text style={styles.aiDisclaimerText}>
                  AI kan göra fel. Granska brevet noga innan du skickar — du ansvarar själv för innehållet.
                </Text>
              </View>

              {/* Corner accents */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Disclaimer modal */}
      <Modal visible={showDisclaimer} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={["#091623", "#0d1e2d"]} style={StyleSheet.absoluteFill} />
            <View style={styles.modalIconWrap}>
              <Feather name="shield" size={26} color={CYAN} />
              <Animated.View style={[styles.modalIconRing, { opacity: glowOpacity }]} />
            </View>
            <Text style={styles.modalTitle}>Viktigt att veta</Text>
            <Text style={styles.modalBody}>
              AI-genererade brev är ett{" "}
              <Text style={{ color: TEXT, fontFamily: "Inter_700Bold" }}>förslag</Text> — inte
              juridisk rådgivning.{"\n\n"}
              {"• "}AI kan göra fel eller missa detaljer{"\n"}
              {"• "}Granska alltid texten innan du skickar{"\n"}
              {"• "}Anpassa innehållet till din situation{"\n"}
              {"• "}Du ansvarar för det du skickar{"\n"}
              {"• "}Vid tveksamhet — kontakta jurist
            </Text>
            <Pressable onPress={acceptDisclaimer}>
              <LinearGradient colors={[CYAN_DIM, CYAN]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalBtn}>
                <Text style={styles.modalBtnText}>Jag förstår — kör igång</Text>
              </LinearGradient>
            </Pressable>

            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

export default function AiGeneratorScreen() {
  return (
    <PremiumGate feature="ai">
      <AiGeneratorScreenInner />
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 16 },

  bgGlowTop: {
    position: "absolute", top: -80, left: -80, right: -80, height: 360,
    backgroundColor: CYAN, borderRadius: 200,
    transform: [{ scaleX: 2 }],
    opacity: 0.08,
    pointerEvents: "none",
  } as any,
  bgGlowBottom: {
    position: "absolute", bottom: -100, right: -60, width: 280, height: 280,
    backgroundColor: CYAN, borderRadius: 140,
    opacity: 0.06,
    pointerEvents: "none",
  } as any,

  header: { flexDirection: "row", alignItems: "center", gap: 0, marginBottom: 20 },

  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },

  aiIconWrap: { width: 52, height: 52, alignItems: "center", justifyContent: "center" },
  aiIconRing: {
    position: "absolute", width: 52, height: 52, borderRadius: 26,
    borderWidth: 1.5, borderColor: CYAN, borderStyle: "dashed",
  },
  aiIconRing2: {
    position: "absolute", width: 44, height: 44, borderRadius: 22,
    borderWidth: 1, borderColor: CYAN,
  },
  aiIconCore: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: CARD_BG, borderWidth: 1.5, borderColor: CYAN,
    alignItems: "center", justifyContent: "center",
    shadowColor: CYAN, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 12, elevation: 10,
  },
  aiIconEmoji: { fontSize: 16 },

  liveChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#0d3020", borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3,
    borderWidth: 1, borderColor: SUCCESS + "40",
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: SUCCESS },
  liveText: { fontSize: 9, fontFamily: "Inter_700Bold", color: SUCCESS, letterSpacing: 0.8 },

  title: { fontSize: 20, fontFamily: "Inter_700Bold", color: TEXT, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", color: TEXT_SEC, marginTop: 2 },

  usageCard: {
    backgroundColor: CARD_BG, borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 14, marginBottom: 24,
  },
  usageLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: TEXT_SEC },
  usageCount: { fontSize: 13, fontFamily: "Inter_700Bold", color: CYAN },
  progressTrack: {
    height: 4, backgroundColor: "#0d2535", borderRadius: 2, overflow: "hidden", position: "relative",
  },
  progressFill: {
    position: "absolute", left: 0, top: 0, bottom: 0,
    backgroundColor: CYAN, borderRadius: 2,
  },
  progressGlow: {
    position: "absolute", left: 0, top: -2, bottom: -2,
    backgroundColor: CYAN, borderRadius: 2, opacity: 0.25,
  },
  usageSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: TEXT_TER, marginTop: 8 },

  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  sectionLine: { flex: 1, height: 1, backgroundColor: CARD_BORDER },
  sectionTitle: { fontSize: 10, fontFamily: "Inter_700Bold", color: TEXT_TER, letterSpacing: 1.2 },

  formPanel: {
    backgroundColor: CARD_BG, borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 16, marginBottom: 20,
  },

  fuLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: TEXT_SEC, marginBottom: 7, letterSpacing: 0.3 },
  fuInputWrap: {
    borderRadius: 12, borderWidth: 1.5, backgroundColor: "#060e17",
    overflow: "hidden", position: "relative",
  },
  fuInputGlow: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12,
    backgroundColor: CYAN, opacity: 0.04,
  },
  fuInput: {
    paddingVertical: 12, paddingHorizontal: 14,
    fontSize: 15, fontFamily: "Inter_400Regular", color: TEXT,
  },

  fuPickerWrap: { borderRadius: 12, borderWidth: 1.5, backgroundColor: "#060e17", overflow: "visible" },
  fuPickerBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 14 },
  fuPickerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: CYAN },
  fuPickerText: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  fuChevronWrap: {
    width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  fuDropdown: {
    marginTop: 4, backgroundColor: "#0d1e2d", borderRadius: 12,
    borderWidth: 1, borderColor: CARD_BORDER, overflow: "hidden",
    shadowColor: CYAN, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  fuDropdownItem: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 12, paddingHorizontal: 14,
  },
  fuDropdownSep: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER },
  fuDropdownBullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: TEXT_TER },
  fuDropdownText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },

  charCount: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "right", marginTop: -4, marginBottom: 4 },

  errorBox: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: DANGER + "12", borderRadius: 12, borderWidth: 1, borderColor: DANGER + "30",
    padding: 12, marginBottom: 14,
  },
  errorText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: DANGER, lineHeight: 18 },

  generateBtn: {
    borderRadius: 16, paddingVertical: 16, paddingHorizontal: 24,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
    shadowColor: CYAN, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 14,
  },
  btnIconWrap: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  generateBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.3 },
  btnGlowLine: {
    height: 1, backgroundColor: CYAN, borderRadius: 1, marginBottom: 18,
    marginHorizontal: 32,
    shadowColor: CYAN, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6,
  },

  resultCard: {
    backgroundColor: CARD_BG, borderRadius: 20, borderWidth: 1.5, borderColor: CYAN + "40",
    padding: 18, marginTop: 8, marginBottom: 20, position: "relative", overflow: "hidden",
    shadowColor: CYAN, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 10,
  },
  resultHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  resultDotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: SUCCESS, shadowColor: SUCCESS, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6 },
  resultTitle: { fontSize: 11, fontFamily: "Inter_700Bold", color: CYAN, letterSpacing: 1.5 },
  resultDivider: { height: 1, backgroundColor: CYAN + "20", marginBottom: 16 },
  resultText: { fontSize: 14, fontFamily: "Inter_400Regular", color: TEXT, lineHeight: 22 },
  copyBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingVertical: 7, paddingHorizontal: 14, borderRadius: 10,
    backgroundColor: CYAN + "15", borderWidth: 1, borderColor: CYAN + "30",
  },
  copyBtnSuccess: { backgroundColor: SUCCESS, borderColor: SUCCESS },
  copyBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: CYAN },
  aiDisclaimer: {
    flexDirection: "row", gap: 7, alignItems: "flex-start",
    marginTop: 16, padding: 10, borderRadius: 10,
    backgroundColor: "#d69e2e12", borderWidth: 1, borderColor: "#d69e2e30",
  },
  aiDisclaimerText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", color: TEXT_SEC, lineHeight: 17 },

  corner: { position: "absolute", width: 12, height: 12 },
  cornerTL: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2, borderColor: CYAN, borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2, borderColor: CYAN, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: CYAN, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2, borderColor: CYAN, borderBottomRightRadius: 4 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalCard: {
    width: "100%", maxWidth: 380, borderRadius: 24, padding: 28, alignItems: "center",
    borderWidth: 1.5, borderColor: CYAN + "30", overflow: "hidden", position: "relative",
    shadowColor: CYAN, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 32, elevation: 20,
  },
  modalIconWrap: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: CYAN + "15",
    borderWidth: 1.5, borderColor: CYAN + "40", alignItems: "center", justifyContent: "center",
    marginBottom: 18, position: "relative",
    shadowColor: CYAN, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 16,
  },
  modalIconRing: {
    position: "absolute", width: 70, height: 70, borderRadius: 35,
    borderWidth: 1, borderColor: CYAN, borderStyle: "dashed",
  },
  modalTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: TEXT, marginBottom: 14, textAlign: "center" },
  modalBody: { fontSize: 14, fontFamily: "Inter_400Regular", color: TEXT_SEC, lineHeight: 22, marginBottom: 24, width: "100%" },
  modalBtn: { width: "100%", paddingVertical: 15, borderRadius: 14, alignItems: "center" },
  modalBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
});
