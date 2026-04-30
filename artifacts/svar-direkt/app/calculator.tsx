import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";

const KOMMUNALSKATT_OPTIONS = [
  { label: "Göteborg", rate: 0.3235 },
  { label: "Stockholm", rate: 0.2998 },
  { label: "Malmö", rate: 0.3335 },
  { label: "Uppsala", rate: 0.3283 },
  { label: "Linköping", rate: 0.3220 },
  { label: "Genomsnitt (32%)", rate: 0.3200 },
];

function calcSwedishTax(grossMonthly: number, kommunRate: number) {
  if (!grossMonthly || grossMonthly <= 0) {
    return { netto: 0, kommunalskatt: 0, statligSkatt: 0, jobbskatteavdrag: 0, effectiveRate: 0 };
  }

  const gross = grossMonthly * 12;

  // Grundavdrag 2024 (simplified)
  let grundavdrag = 13900;
  if (gross <= 20600) grundavdrag = 13900;
  else if (gross <= 100500) grundavdrag = 13900 + 0.2 * (gross - 20600);
  else if (gross <= 150600) grundavdrag = 29820;
  else if (gross <= 397400) grundavdrag = 29820 - 0.1 * (gross - 150600);
  else grundavdrag = 5100;

  const taxable = Math.max(0, gross - grundavdrag);

  // Kommunalskatt
  const kommunalskattY = taxable * kommunRate;

  // Jobbskatteavdrag 2024 (simplified)
  let ja = 0;
  if (gross <= 100900) {
    ja = 0.3453 * Math.min(gross, 100900) - kommunRate * grundavdrag;
  } else if (gross <= 360700) {
    ja = 0.3453 * 100900 - kommunRate * grundavdrag;
  } else if (gross <= 600300) {
    ja = 0.3453 * 100900 - kommunRate * grundavdrag - 0.03 * (gross - 360700);
  } else {
    ja = 0.3453 * 100900 - kommunRate * grundavdrag - 0.03 * (600300 - 360700);
  }
  ja = Math.max(0, ja);

  // Statlig inkomstskatt: 20% powyżej 598 500 SEK/rok (2024)
  const statligY = Math.max(0, gross - 598500) * 0.2;

  const netYearly = gross - kommunalskattY + ja - statligY;
  const totalTax = gross - netYearly;
  const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

  return {
    netto: Math.round(netYearly / 12),
    kommunalskatt: Math.round((kommunalskattY - ja) / 12),
    statligSkatt: Math.round(statligY / 12),
    jobbskatteavdrag: Math.round(ja / 12),
    effectiveRate: Math.round(effectiveRate * 10) / 10,
  };
}

function fmt(n: number) {
  return n.toLocaleString("sv-SE") + " kr";
}

export default function CalculatorScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [grossStr, setGrossStr] = useState("");
  const [kommunIndex, setKommunIndex] = useState(5);
  const [showKomm, setShowKomm] = useState(false);

  const gross = parseInt(grossStr.replace(/\s/g, ""), 10) || 0;
  const kommunRate = KOMMUNALSKATT_OPTIONS[kommunIndex].rate;

  const result = useMemo(() => calcSwedishTax(gross, kommunRate), [gross, kommunRate]);

  const hasResult = gross > 0;
  const nettoRatio = gross > 0 ? result.netto / gross : 0;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: Colors.primary + "10", borderColor: Colors.primary + "30" }]}>
          <Feather name="info" size={14} color={Colors.primary} />
          <Text style={[styles.infoText, { color: Colors.primary }]}>
            Ungefärliga beräkningar enligt Sveriges skattesatser 2024. Baserat på månadslön brutto.
          </Text>
        </View>

        {/* Input */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Bruttolön (SEK/månad)</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.cardBorder }]}
              placeholder="t.ex. 35 000"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numeric"
              value={grossStr}
              onChangeText={(t) => setGrossStr(t.replace(/[^0-9\s]/g, ""))}
            />
            <Text style={[styles.currency, { color: theme.textSecondary }]}>kr</Text>
          </View>

          {/* Kommunalskatt selector */}
          <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>Kommun (kommunalskatt)</Text>
          <Pressable
            onPress={() => { setShowKomm(!showKomm); Haptics.selectionAsync(); }}
            style={[styles.selector, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}
          >
            <Text style={[styles.selectorText, { color: theme.text }]}>
              {KOMMUNALSKATT_OPTIONS[kommunIndex].label} ({(kommunRate * 100).toFixed(1)}%)
            </Text>
            <Feather name={showKomm ? "chevron-up" : "chevron-down"} size={16} color={theme.textSecondary} />
          </Pressable>

          {showKomm && (
            <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              {KOMMUNALSKATT_OPTIONS.map((opt, i) => (
                <Pressable
                  key={opt.label}
                  onPress={() => { setKommunIndex(i); setShowKomm(false); Haptics.selectionAsync(); }}
                  style={[
                    styles.dropdownItem,
                    i < KOMMUNALSKATT_OPTIONS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.cardBorder },
                    i === kommunIndex && { backgroundColor: Colors.primary + "12" },
                  ]}
                >
                  <Text style={[styles.dropdownText, { color: i === kommunIndex ? Colors.primary : theme.text }]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.dropdownRate, { color: theme.textSecondary }]}>
                    {(opt.rate * 100).toFixed(2)}%
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Result */}
        {hasResult && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {/* Netto big */}
            <View style={styles.nettoHeader}>
              <Text style={[styles.nettoLabel, { color: theme.textSecondary }]}>Netto (utbetalat)</Text>
              <Text style={[styles.nettoValue, { color: theme.success }]}>{fmt(result.netto)}</Text>
            </View>

            {/* Bar */}
            <View style={[styles.bar, { backgroundColor: theme.background }]}>
              <View style={[styles.barFill, { width: `${Math.min(100, nettoRatio * 100)}%` as any, backgroundColor: theme.success }]} />
            </View>
            <Text style={[styles.barLabel, { color: theme.textSecondary }]}>
              {result.effectiveRate}% effektiv skattesats
            </Text>

            {/* Breakdown */}
            <View style={[styles.separator, { backgroundColor: theme.separator }]} />

            <Row label="Brutto" value={fmt(gross)} color={theme.text} theme={theme} />
            <Row label="Kommunalskatt" value={"−" + fmt(result.kommunalskatt + result.jobbskatteavdrag)} color={theme.danger} theme={theme} note="(po jobbskatteavdrag)" />
            {result.statligSkatt > 0 && (
              <Row label="Statlig skatt (20%)" value={"−" + fmt(result.statligSkatt)} color={theme.danger} theme={theme} />
            )}
            <View style={[styles.separator, { backgroundColor: theme.separator }]} />
            <Row label="Netto / månad" value={fmt(result.netto)} color={theme.success} theme={theme} bold />
            <Row label="Netto / år" value={fmt(result.netto * 12)} color={theme.textSecondary} theme={theme} />
          </View>
        )}

        {/* No result placeholder */}
        {!hasResult && (
          <View style={[styles.placeholder, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={{ fontSize: 36 }}>🧮</Text>
            <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
              Ange din bruttolön för att se hur mycket du får netto i Sverige.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Row({ label, value, color, theme, note, bold }: {
  label: string; value: string; color: string; theme: any; note?: string; bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={[styles.rowLabel, { color: theme.textSecondary, fontWeight: bold ? "700" : "400" }]}>{label}</Text>
        {note && <Text style={[styles.rowNote, { color: theme.textTertiary }]}>{note}</Text>}
      </View>
      <Text style={[styles.rowValue, { color, fontWeight: bold ? "700" : "600" }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 14 },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  infoText: { fontSize: 12, flex: 1, lineHeight: 17 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 4 },
  label: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: { flex: 1, fontSize: 22, fontWeight: "700", borderBottomWidth: 2, paddingVertical: 6 },
  currency: { fontSize: 16, fontWeight: "600" },
  selector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 10, borderWidth: 1 },
  selectorText: { fontSize: 14, fontWeight: "500" },
  dropdown: { borderRadius: 10, borderWidth: 1, overflow: "hidden", marginTop: 4 },
  dropdownItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12 },
  dropdownText: { fontSize: 14, fontWeight: "500" },
  dropdownRate: { fontSize: 13 },
  nettoHeader: { alignItems: "center", paddingVertical: 8 },
  nettoLabel: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  nettoValue: { fontSize: 36, fontWeight: "800", marginTop: 4 },
  bar: { height: 8, borderRadius: 4, overflow: "hidden", marginVertical: 8 },
  barFill: { height: 8, borderRadius: 4 },
  barLabel: { fontSize: 12, textAlign: "center", marginBottom: 4 },
  separator: { height: StyleSheet.hairlineWidth, marginVertical: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingVertical: 4 },
  rowLabel: { fontSize: 14 },
  rowNote: { fontSize: 11, marginTop: 1 },
  rowValue: { fontSize: 14 },
  placeholder: { alignItems: "center", padding: 32, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, gap: 12 },
  placeholderText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
