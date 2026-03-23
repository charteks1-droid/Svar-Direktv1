import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";

const GLOSSARY = [
  {
    term: "Hyresrätt",
    def: "En boendeform där man hyr sin bostad av en hyresvärd och betalar hyra varje månad.",
  },
  {
    term: "Hyresnämnden",
    def: "En statlig myndighet som hanterar tvister mellan hyresgäster och hyresvärdar.",
  },
  {
    term: "Boverket",
    def: "Statlig myndighet som ansvarar för samhällsplanering, byggande och boende.",
  },
  {
    term: "Deposition",
    def: "En säkerhet som hyresgästen betalar till hyresvärden och ska återbetalas vid utflytt.",
  },
  {
    term: "Uppsägningstid",
    def: "Den tid som måste gå mellan uppsägning och när hyresavtalet upphör. Vanligtvis 3 månader.",
  },
  {
    term: "Andrahandsuthyrning",
    def: "Att som hyresgäst hyra ut sin hyresrätt till en annan person. Kräver tillstånd från hyresvärden.",
  },
  {
    term: "Besiktning",
    def: "Genomgång av lägenheten för att dokumentera skador och brister, sker vid in- och utflytt.",
  },
];

const TIPS = [
  "Dokumentera alltid fel och brister skriftligen.",
  "Spara kopior av all kommunikation med din hyresvärd.",
  "Kontakta Hyresgästföreningen vid tvister.",
  "Fotografera skador vid inflyttning och utflytt.",
  "Kontrollera alltid uppsägningstiden i ditt kontrakt.",
];

interface GlossaryCardProps {
  term: string;
  def: string;
}

function GlossaryCard({ term, def }: GlossaryCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.glossaryCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.term, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
        {term}
      </Text>
      <Text style={[styles.def, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
        {def}
      </Text>
    </View>
  );
}

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 30 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={[styles.infoIcon, { backgroundColor: Colors.primary + "18" }]}>
          <Feather name="message-square" size={28} color={Colors.primary} />
        </View>
        <Text style={[styles.appName, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
          Svar Direkt
        </Text>
        <Text style={[styles.appVersion, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.appDesc, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          En app för att snabbt och professionellt hantera kommunikation med din hyresvärd.
          Baseras på Boverkets riktlinjer och hyreslagstiftningen.
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
        TIPS FÖR HYRESGÄSTER
      </Text>
      <View style={[styles.tipsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        {TIPS.map((tip, i) => (
          <View key={i} style={[styles.tipRow, i < TIPS.length - 1 ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.separator } : {}]}>
            <View style={[styles.tipNum, { backgroundColor: Colors.primary + "18" }]}>
              <Text style={[styles.tipNumText, { color: Colors.primary, fontFamily: "Inter_700Bold" }]}>
                {i + 1}
              </Text>
            </View>
            <Text style={[styles.tipText, { color: theme.text, fontFamily: "Inter_400Regular" }]}>
              {tip}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
        ORDLISTA
      </Text>
      {GLOSSARY.map((g) => (
        <GlossaryCard key={g.term} term={g.term} def={g.def} />
      ))}

      <View style={[styles.legalCard, { backgroundColor: theme.backgroundTertiary }]}>
        <MaterialCommunityIcons name="scale-balance" size={18} color={Colors.primary} />
        <Text style={[styles.legalText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Mallarna i appen är vägledande och ska anpassas efter din specifika situation.
          Vid allvarliga tvister rekommenderas kontakt med Hyresgästföreningen eller juridisk rådgivning.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  infoCard: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 24,
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  appName: { fontSize: 24 },
  appVersion: { fontSize: 14 },
  appDesc: { fontSize: 14, textAlign: "center", lineHeight: 20, marginTop: 4 },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 4,
  },
  tipsCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    marginBottom: 4,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    gap: 12,
  },
  tipNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipNumText: { fontSize: 13 },
  tipText: { flex: 1, fontSize: 14, lineHeight: 20 },
  glossaryCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 6,
  },
  term: { fontSize: 16 },
  def: { fontSize: 13, lineHeight: 19 },
  legalCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  legalText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
