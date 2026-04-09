import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Modal,
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
import { useApp } from "@/contexts/AppContext";

type Step1Option =
  | "skuld"
  | "kaninte"
  | "avbetalning"
  | "kravbrev"
  | "bestrida"
  | "mertid"
  | "pausa"
  | "betalat";

type Step2Option = "kronofogden" | "inkasso";

const STEP1_OPTIONS: { id: Step1Option; label: string }[] = [
  { id: "skuld", label: "Jag har skuld" },
  { id: "kaninte", label: "Jag kan inte betala" },
  { id: "avbetalning", label: "Jag vill ha avbetalning" },
  { id: "kravbrev", label: "Jag har fått kravbrev" },
  { id: "bestrida", label: "Jag vill bestrida kravet" },
  { id: "mertid", label: "Jag behöver mer tid" },
  { id: "pausa", label: "Jag vill pausa ärendet" },
  { id: "betalat", label: "Jag har redan betalat" },
];

const STEP2_OPTIONS: { id: Step2Option; label: string }[] = [
  { id: "kronofogden", label: "Kronofogden" },
  { id: "inkasso", label: "Inkasso" },
];

const MESSAGES: Record<Step1Option, Record<Step2Option, string>> = {
  skuld: {
    kronofogden: `Hej,

Jag skriver angående en skuld som är registrerad hos Kronofogden.

Jag är medveten om situationen och vill ta ansvar för att lösa den. Jag befinner mig just nu i en svår ekonomisk period och har tyvärr inte möjlighet att betala hela beloppet på en gång.

Jag önskar därför diskutera möjligheten till en avbetalningsplan som passar mina nuvarande förhållanden.

Jag är villig att samarbeta och hoppas på en lösning.

Med vänliga hälsningar`,
    inkasso: `Hej,

Jag kontaktar er angående en skuld som ni hanterar för er kunds räkning.

Jag är medveten om skulden och vill ta ansvar för att lösa situationen. Mina ekonomiska möjligheter är begränsade just nu, men jag vill gärna hitta en lösning.

Är det möjligt att diskutera en avbetalningsplan?

Vänligen återkom med era möjligheter.

Med vänliga hälsningar`,
  },
  kaninte: {
    kronofogden: `Hej,

Jag har ekonomiska svårigheter just nu och har tyvärr inte möjlighet att betala hela skulden direkt.

Jag vill därför ansöka om en avbetalningsplan och hitta en lösning tillsammans med er.

Jag är villig att samarbeta för att lösa situationen.

Vänligen återkom med förslag.

Med vänliga hälsningar`,
    inkasso: `Hej,

Jag har tagit del av ert krav och vill informera om att jag för närvarande har begränsade ekonomiska möjligheter.

Jag kan tyvärr inte betala hela beloppet just nu, men jag vill gärna hitta en lösning tillsammans med er.

Finns det möjlighet till en avbetalningsplan?

Vänligen återkom.

Med vänliga hälsningar`,
  },
  avbetalning: {
    kronofogden: `Hej,

Jag har ekonomiska svårigheter just nu och har tyvärr inte möjlighet att betala hela skulden direkt.

Jag vill därför ansöka om en avbetalningsplan och hitta en lösning tillsammans med er.

Jag är villig att samarbeta för att lösa situationen.

Vänligen återkom med förslag.

Med vänliga hälsningar`,
    inkasso: `Hej,

Jag kontaktar er angående er faktura och önskar ansöka om en avbetalningsplan.

Mina ekonomiska förhållanden tillåter inte att jag betalar hela beloppet på en gång, men jag vill gärna betala av skulden i rimliga delar.

Kan vi komma överens om ett avbetalningsupplägg?

Vänligen återkom med förslag.

Med vänliga hälsningar`,
  },
  kravbrev: {
    kronofogden: `Hej,

Jag har mottagit ett krav från Kronofogden och vill ta kontakt för att diskutera situationen.

Jag befinner mig i en ekonomisk svår period och har inte möjlighet att betala hela beloppet omedelbart. Jag önskar dock samarbeta för att hitta en lösning.

Kan vi diskutera möjligheten till en avbetalningsplan?

Vänligen återkom.

Med vänliga hälsningar`,
    inkasso: `Hej,

Jag har tagit emot ert kravbrev och vill bekräfta att jag är medveten om fordran.

Jag har för närvarande begränsade ekonomiska möjligheter och kan tyvärr inte betala hela beloppet på en gång. Jag vill dock lösa situationen och hoppas vi kan hitta en gemensam lösning.

Finns det möjlighet till en avbetalningsplan eller annan uppgörelse?

Vänligen återkom.

Med vänliga hälsningar`,
  },
  bestrida: {
    kronofogden: `Hej,

Jag bestrider härmed kravet då jag anser att det är felaktigt.

Jag ber er att pausa ärendet tills frågan har utretts.

Vänligen skicka underlag som styrker kravet.

Med vänliga hälsningar`,
    inkasso: `Hej,

Jag bestrider härmed kravet då jag anser att det är felaktigt.

Jag ber er att pausa ärendet tills frågan har utretts.

Vänligen skicka underlag som styrker kravet.

Med vänliga hälsningar`,
  },
  mertid: {
    kronofogden: `Hej,

Jag har tagit del av ert meddelande men har för närvarande inte möjlighet att agera inom angiven tid.

Jag ber därför om anstånd och uppskov för att kunna hantera ärendet på ett korrekt sätt.

Vänligen bekräfta ny tidsfrist.

Med vänliga hälsningar`,
    inkasso: `Hej,

Jag har tagit del av ert meddelande men har för närvarande inte möjlighet att agera inom angiven tid.

Jag ber därför om anstånd och uppskov för att kunna hantera ärendet på ett korrekt sätt.

Vänligen bekräfta ny tidsfrist.

Med vänliga hälsningar`,
  },
  pausa: {
    kronofogden: `Hej,

Jag ber er att tillfälligt pausa ärendet då min ekonomiska situation just nu är mycket begränsad.

Jag återkommer så snart jag har möjlighet att ta nästa steg.

Tack för er förståelse.

Med vänliga hälsningar`,
    inkasso: `Hej,

Jag ber er att tillfälligt pausa ärendet då min ekonomiska situation just nu är mycket begränsad.

Jag återkommer så snart jag har möjlighet att ta nästa steg.

Tack för er förståelse.

Med vänliga hälsningar`,
  },
  betalat: {
    kronofogden: `Hej,

Jag har redan genomfört betalning för detta ärende.

Jag ber er kontrollera detta och återkomma med bekräftelse.

Om ytterligare information behövs kan jag tillhandahålla kvitto.

Med vänliga hälsningar`,
    inkasso: `Hej,

Jag har redan genomfört betalning för detta ärende.

Jag ber er kontrollera detta och återkomma med bekräftelse.

Om ytterligare information behövs kan jag tillhandahålla kvitto.

Med vänliga hälsningar`,
  },
};

function DisclaimerModal({
  visible,
  onAccept,
}: {
  visible: boolean;
  onAccept: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.disclaimerCard,
            { backgroundColor: theme.card, paddingBottom: Math.max(insets.bottom + 20, 28) },
          ]}
        >
          <View style={[styles.disclaimerIcon, { backgroundColor: Colors.primary + "18" }]}>
            <Feather name="shield" size={28} color={Colors.primary} />
          </View>
          <Text
            style={[
              styles.disclaimerTitle,
              { color: theme.text, fontFamily: "Inter_700Bold" },
            ]}
          >
            Viktig information
          </Text>
          <Text
            style={[
              styles.disclaimerBody,
              { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
          >
            Denna app ger endast vägledande texter och ersätter inte juridisk rådgivning. Användaren ansvarar själv för hur informationen används.
          </Text>
          <Pressable
            onPress={onAccept}
            style={({ pressed }) => [
              styles.disclaimerBtn,
              {
                backgroundColor: Colors.primary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text
              style={[
                styles.disclaimerBtnText,
                { fontFamily: "Inter_700Bold" },
              ]}
            >
              Jag förstår
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function StepButton({ label, onPress }: { label: string; onPress: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.stepBtn,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Text
        style={[styles.stepBtnText, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
      >
        {label}
      </Text>
      <Feather name="chevron-right" size={20} color={Colors.primary} />
    </Pressable>
  );
}

export default function QuickSolutionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { addToHistory, disclaimerAccepted, acceptDisclaimer } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1, setStep1] = useState<Step1Option | null>(null);
  const [step2, setStep2] = useState<Step2Option | null>(null);
  const [copied, setCopied] = useState(false);
  const [namn, setNamn] = useState("");
  const [arendenummer, setArendenummer] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
    }
  }, [disclaimerAccepted]);

  const baseMessage = step1 && step2 ? MESSAGES[step1][step2] : "";

  const buildFinalMessage = () => {
    let msg = baseMessage;
    const hasNamn = namn.trim().length > 0;
    const hasArendenummer = arendenummer.trim().length > 0;
    if (hasNamn || hasArendenummer) {
      msg += "\n";
      if (hasNamn) msg += `\nNamn: ${namn.trim()}`;
      if (hasArendenummer) msg += `\nÄrendenummer: ${arendenummer.trim()}`;
    }
    return msg;
  };

  const handleStep1 = async (option: Step1Option) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep1(option);
    setStep(2);
  };

  const handleStep2 = async (option: Step2Option) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep2(option);
    setStep(3);
    if (step1) {
      const msg = MESSAGES[step1][option];
      const label = STEP1_OPTIONS.find((o) => o.id === step1)?.label ?? "";
      addToHistory({
        templateTitle: `${label} – ${option === "kronofogden" ? "Kronofogden" : "Inkasso"}`,
        content: msg,
      });
    }
  };

  const handleEmail = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const finalMsg = buildFinalMessage();
    const subject = encodeURIComponent("Ärende – begäran");
    const body = encodeURIComponent(finalMsg);
    const url = `mailto:?subject=${subject}&body=${body}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("E-post ej tillgänglig", "Ingen e-postapp hittades på enheten.");
    }
  };

  const handleCopy = async () => {
    const finalMsg = buildFinalMessage();
    await Clipboard.setStringAsync(finalMsg);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(1);
    setStep1(null);
    setStep2(null);
    setCopied(false);
    setNamn("");
    setArendenummer("");
  };

  const handleAcceptDisclaimer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    acceptDisclaimer();
    setShowDisclaimer(false);
  };

  const step1Label = STEP1_OPTIONS.find((o) => o.id === step1)?.label ?? "";
  const step2Label = step2 === "kronofogden" ? "Kronofogden" : "Inkasso";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <DisclaimerModal
        visible={showDisclaimer}
        onAccept={handleAcceptDisclaimer}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 30 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress dots */}
        <View style={styles.progressRow}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                {
                  backgroundColor: s <= step ? Colors.primary : theme.cardBorder,
                  width: s === step ? 28 : 8,
                },
              ]}
            />
          ))}
          <Text
            style={[
              styles.progressLabel,
              { color: theme.textTertiary, fontFamily: "Inter_400Regular" },
            ]}
          >
            Steg {step} av 3
          </Text>
        </View>

        {/* Breadcrumb on step 3 */}
        {step === 3 && (
          <View style={styles.breadcrumb}>
            <Text style={[styles.breadcrumbText, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
              {step1Label}
            </Text>
            <Feather name="chevron-right" size={12} color={theme.textTertiary} />
            <Text style={[styles.breadcrumbText, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
              {step2Label}
            </Text>
          </View>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
              Vad behöver du{"\n"}hjälp med?
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Välj det alternativ som stämmer bäst
            </Text>
            <View style={styles.optionsStack}>
              {STEP1_OPTIONS.map((opt) => (
                <StepButton
                  key={opt.id}
                  label={opt.label}
                  onPress={() => handleStep1(opt.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Pressable onPress={handleReset} style={styles.backLink}>
              <Feather name="arrow-left" size={16} color={Colors.primary} />
              <Text style={[styles.backLinkText, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
                Tillbaka
              </Text>
            </Pressable>
            <Text style={[styles.stepTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
              Var gäller det?
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Välj den myndighet eller instans som kontaktat dig
            </Text>
            <View style={styles.optionsStack}>
              {STEP2_OPTIONS.map((opt) => (
                <StepButton
                  key={opt.id}
                  label={opt.label}
                  onPress={() => handleStep2(opt.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.successBanner}>
              <View style={[styles.successIcon, { backgroundColor: Colors.primary + "20" }]}>
                <Feather name="check-circle" size={28} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.successTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
                  Ditt meddelande är klart
                </Text>
                <Text style={[styles.successSub, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  Kopiera och skicka till {step2Label}
                </Text>
              </View>
            </View>

            {/* Personalization fields */}
            <View style={[styles.personSection, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.personTitle, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
                VALFRIA UPPGIFTER
              </Text>
              <View style={[styles.personField, { borderBottomColor: theme.separator }]}>
                <Text style={[styles.personLabel, { color: theme.textTertiary, fontFamily: "Inter_500Medium" }]}>
                  Namn
                </Text>
                <TextInput
                  value={namn}
                  onChangeText={setNamn}
                  placeholder="Ditt namn (valfritt)"
                  placeholderTextColor={theme.textTertiary}
                  style={[styles.personInput, { color: theme.text, fontFamily: "Inter_400Regular" }]}
                />
              </View>
              <View style={styles.personField}>
                <Text style={[styles.personLabel, { color: theme.textTertiary, fontFamily: "Inter_500Medium" }]}>
                  Ärendenummer
                </Text>
                <TextInput
                  value={arendenummer}
                  onChangeText={setArendenummer}
                  placeholder="Ärendenummer (valfritt)"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="default"
                  style={[styles.personInput, { color: theme.text, fontFamily: "Inter_400Regular" }]}
                />
              </View>
            </View>

            {/* Message preview */}
            <View style={[styles.messageBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.messageText, { color: theme.text, fontFamily: "Inter_400Regular" }]} selectable>
                {baseMessage}
                {(namn.trim() || arendenummer.trim()) ? (
                  `\n${namn.trim() ? `\nNamn: ${namn.trim()}` : ""}${arendenummer.trim() ? `\nÄrendenummer: ${arendenummer.trim()}` : ""}`
                ) : ""}
              </Text>
            </View>

            <View style={[styles.hintBox, { backgroundColor: theme.backgroundTertiary }]}>
              <Feather name="info" size={14} color={Colors.primary} />
              <Text style={[styles.hintText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
                Fyll i ditt namn och ärendenummer ovan om du vill inkludera dem i meddelandet.
              </Text>
            </View>

            <Pressable
              onPress={handleCopy}
              style={({ pressed }) => [
                styles.copyBtn,
                {
                  backgroundColor: copied ? theme.success : Colors.primary,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Feather name={copied ? "check" : "copy"} size={20} color="#fff" />
              <Text style={[styles.copyBtnText, { fontFamily: "Inter_700Bold" }]}>
                {copied ? "Kopierat!" : "Kopiera meddelande"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleEmail}
              style={[styles.emailBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <Feather name="mail" size={18} color={theme.textSecondary} />
              <Text style={[styles.emailBtnText, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
                Skicka via e-post
              </Text>
            </Pressable>

            <Pressable
              onPress={handleReset}
              style={[styles.resetBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <Feather name="refresh-cw" size={18} color={theme.textSecondary} />
              <Text style={[styles.resetBtnText, { color: theme.textSecondary, fontFamily: "Inter_500Medium" }]}>
                Börja om
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, flexGrow: 1 },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 28,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    marginLeft: 6,
  },

  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  breadcrumbText: { fontSize: 13 },

  stepContainer: { gap: 16 },

  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  backLinkText: { fontSize: 15 },

  stepTitle: {
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: -8,
  },

  optionsStack: { gap: 10, marginTop: 4 },

  stepBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  stepBtnText: { fontSize: 17 },

  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 4,
  },
  successIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  successTitle: { fontSize: 20 },
  successSub: { fontSize: 14, marginTop: 2 },

  personSection: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  personTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  personField: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  personLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  personInput: {
    fontSize: 16,
    paddingVertical: 0,
  },

  messageBox: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
  },

  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  hintText: { flex: 1, fontSize: 13, lineHeight: 18 },

  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    borderRadius: 16,
    marginTop: 4,
  },
  copyBtnText: {
    color: "#fff",
    fontSize: 17,
  },

  emailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
  },
  emailBtnText: { fontSize: 15 },

  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  resetBtnText: { fontSize: 15 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  disclaimerCard: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 14,
  },
  disclaimerIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  disclaimerTitle: {
    fontSize: 22,
    textAlign: "center",
  },
  disclaimerBody: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  disclaimerBtn: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  disclaimerBtnText: {
    color: "#fff",
    fontSize: 17,
  },
});
