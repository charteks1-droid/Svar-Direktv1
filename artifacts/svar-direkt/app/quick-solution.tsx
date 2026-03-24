import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";

type Step1Option = "skuld" | "kaninte" | "avbetalning" | "kravbrev";
type Step2Option = "kronofogden" | "inkasso";

const STEP1_OPTIONS: { id: Step1Option; label: string }[] = [
  { id: "skuld", label: "Jag har skuld" },
  { id: "kaninte", label: "Jag kan inte betala" },
  { id: "avbetalning", label: "Jag vill ha avbetalning" },
  { id: "kravbrev", label: "Jag har fått kravbrev" },
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
};

interface StepButtonProps {
  label: string;
  onPress: () => void;
}

function StepButton({ label, onPress }: StepButtonProps) {
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
        style={[
          styles.stepBtnText,
          { color: theme.text, fontFamily: "Inter_600SemiBold" },
        ]}
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
  const { addToHistory } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1, setStep1] = useState<Step1Option | null>(null);
  const [step2, setStep2] = useState<Step2Option | null>(null);
  const [copied, setCopied] = useState(false);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const message =
    step1 && step2 ? MESSAGES[step1][step2] : "";

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
      const title = `${STEP1_OPTIONS.find((o) => o.id === step1)?.label} – ${
        option === "kronofogden" ? "Kronofogden" : "Inkasso"
      }`;
      addToHistory({ templateTitle: title, content: msg });
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(message);
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
  };

  const step1Label = STEP1_OPTIONS.find((o) => o.id === step1)?.label ?? "";
  const step2Label = step2 === "kronofogden" ? "Kronofogden" : "Inkasso";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPad + 30 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress indicator */}
        <View style={styles.progressRow}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    s <= step ? Colors.primary : theme.cardBorder,
                  width: s === step ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Breadcrumb for step 3 */}
        {step === 3 && (
          <View style={styles.breadcrumb}>
            <Text
              style={[
                styles.breadcrumbText,
                { color: theme.textTertiary, fontFamily: "Inter_400Regular" },
              ]}
            >
              {step1Label}
            </Text>
            <Feather name="chevron-right" size={12} color={theme.textTertiary} />
            <Text
              style={[
                styles.breadcrumbText,
                { color: theme.textTertiary, fontFamily: "Inter_400Regular" },
              ]}
            >
              {step2Label}
            </Text>
          </View>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text
              style={[
                styles.stepTitle,
                { color: theme.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              Vad behöver du{"\n"}hjälp med?
            </Text>
            <Text
              style={[
                styles.stepSubtitle,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
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
            <Pressable
              onPress={handleReset}
              style={styles.backLink}
            >
              <Feather name="arrow-left" size={16} color={Colors.primary} />
              <Text
                style={[
                  styles.backLinkText,
                  { color: Colors.primary, fontFamily: "Inter_500Medium" },
                ]}
              >
                Tillbaka
              </Text>
            </Pressable>
            <Text
              style={[
                styles.stepTitle,
                { color: theme.text, fontFamily: "Inter_700Bold" },
              ]}
            >
              Var gäller det?
            </Text>
            <Text
              style={[
                styles.stepSubtitle,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
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
              <View
                style={[
                  styles.successIcon,
                  { backgroundColor: Colors.primary + "20" },
                ]}
              >
                <Feather name="check-circle" size={28} color={Colors.primary} />
              </View>
              <View>
                <Text
                  style={[
                    styles.successTitle,
                    { color: theme.text, fontFamily: "Inter_700Bold" },
                  ]}
                >
                  Ditt meddelande är klart
                </Text>
                <Text
                  style={[
                    styles.successSub,
                    {
                      color: theme.textSecondary,
                      fontFamily: "Inter_400Regular",
                    },
                  ]}
                >
                  Kopiera och skicka till {step2Label}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.messageBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: theme.text, fontFamily: "Inter_400Regular" },
                ]}
                selectable
              >
                {message}
              </Text>
            </View>

            <View
              style={[
                styles.hintBox,
                { backgroundColor: theme.backgroundTertiary },
              ]}
            >
              <Feather name="info" size={14} color={Colors.primary} />
              <Text
                style={[
                  styles.hintText,
                  {
                    color: theme.textSecondary,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                Lägg till ditt namn och eventuellt ärendenummer i slutet av meddelandet.
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
              <Feather
                name={copied ? "check" : "copy"}
                size={20}
                color="#fff"
              />
              <Text
                style={[
                  styles.copyBtnText,
                  { fontFamily: "Inter_700Bold" },
                ]}
              >
                {copied ? "Kopierat!" : "Kopiera meddelande"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleReset}
              style={[
                styles.resetBtn,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <Feather name="refresh-cw" size={16} color={theme.textSecondary} />
              <Text
                style={[
                  styles.resetBtnText,
                  {
                    color: theme.textSecondary,
                    fontFamily: "Inter_500Medium",
                  },
                ]}
              >
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
  content: {
    padding: 20,
    flexGrow: 1,
  },
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
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  breadcrumbText: {
    fontSize: 13,
  },
  stepContainer: {
    gap: 16,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  backLinkText: {
    fontSize: 15,
  },
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
  optionsStack: {
    gap: 10,
    marginTop: 8,
  },
  stepBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  stepBtnText: {
    fontSize: 17,
  },
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
  },
  successTitle: {
    fontSize: 20,
  },
  successSub: {
    fontSize: 14,
    marginTop: 2,
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
  hintText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
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
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  resetBtnText: {
    fontSize: 15,
  },
});
