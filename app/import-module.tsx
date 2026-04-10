import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { ModuleData, useApp } from "@/contexts/AppContext";

function validate(data: unknown): data is ModuleData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (typeof d.version !== "number") return false;
  if (typeof d.name !== "string" || !d.name.trim()) return false;
  if (d.quickResponses !== undefined && !Array.isArray(d.quickResponses)) return false;
  if (d.customTemplates !== undefined && !Array.isArray(d.customTemplates)) return false;
  return true;
}

export default function ImportModuleScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { importModule } = useApp();
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ name: string; qr: number; tpl: number } | null>(null);

  const handlePick = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const picked = await DocumentPicker.getDocumentAsync({
        type: Platform.OS === "ios" ? "public.json" : "application/json",
        copyToCacheDirectory: true,
      });

      if (picked.canceled || !picked.assets?.length) return;

      setLoading(true);
      const file = picked.assets[0];

      let text: string;
      try {
        text = await FileSystem.readAsStringAsync(file.uri);
      } catch {
        Alert.alert("Läsfel", "Kunde inte läsa filen. Kontrollera behörigheter.");
        setLoading(false);
        return;
      }

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        Alert.alert("Felaktig modulfil", "Filen innehåller inte giltig JSON.");
        setLoading(false);
        return;
      }

      if (!validate(data)) {
        Alert.alert(
          "Felaktig modulfil",
          'Modulen saknar obligatoriska fält. JSON-filen måste ha "version" (nummer) och "name" (text).'
        );
        setLoading(false);
        return;
      }

      const result = await importModule(data);
      setLastResult({ name: data.name, qr: result.addedQuickResponses, tpl: result.addedTemplates });

      const total = result.addedQuickResponses + result.addedTemplates;
      if (total === 0) {
        Alert.alert("Modul inläst", "Inga nya poster hittades (allt finns redan).");
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "Modul installerad ✓",
          `"${data.name}" importerades.\n\n• ${result.addedQuickResponses} snabba svar\n• ${result.addedTemplates} mallar`
        );
      }
    } catch (err) {
      Alert.alert("Fel", "Något gick fel vid import. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => router.back()}
        style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      >
        <Feather name="arrow-left" size={20} color={theme.text} />
      </Pressable>

      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: Colors.primary + "18" }]}>
          <Feather name="package" size={32} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
          Lägg till modul
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Importera en JSON-fil med snabba svar och mallar direkt till appen.
        </Text>
      </View>

      <View style={[styles.formatCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.formatTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
          Modulformat (JSON)
        </Text>
        <View style={[styles.codeBlock, { backgroundColor: theme.backgroundSecondary ?? theme.background }]}>
          <Text style={[styles.code, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {`{\n  "version": 1,\n  "name": "Modulnamn",\n  "quickResponses": [\n    { "id": "q1", "title": "...", "content": "..." }\n  ],\n  "customTemplates": [\n    { "id": "t1", "title": "...", "category": "...", "content": "..." }\n  ]\n}`}
          </Text>
        </View>
        <View style={styles.rulesList}>
          {[
            "Endast data — ingen kod",
            "Befintliga poster skrivs inte över",
            "Dubbletter (samma ID eller titel) ignoreras",
            "Fungerar helt offline",
          ].map((rule) => (
            <View key={rule} style={styles.ruleRow}>
              <Feather name="check-circle" size={14} color={Colors.primary} />
              <Text style={[styles.ruleText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
                {rule}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {lastResult && (
        <View style={[styles.resultCard, { backgroundColor: Colors.primary + "10", borderColor: Colors.primary + "30" }]}>
          <Feather name="check-circle" size={18} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.resultTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
              Senast importerad: {lastResult.name}
            </Text>
            <Text style={[styles.resultSub, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {lastResult.qr} snabba svar · {lastResult.tpl} mallar
            </Text>
          </View>
        </View>
      )}

      <Pressable
        onPress={handlePick}
        disabled={loading}
        style={({ pressed }) => [
          styles.pickBtn,
          {
            backgroundColor: loading ? (Colors.primary + "60") : Colors.primary,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <Feather name={loading ? "loader" : "upload"} size={20} color="#fff" />
        <Text style={[styles.pickBtnText, { fontFamily: "Inter_600SemiBold" }]}>
          {loading ? "Importerar…" : "Välj JSON-fil"}
        </Text>
      </Pressable>

      <Text style={[styles.hint, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
        Filen läses lokalt på enheten. Ingen data skickas till internet.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 24,
  },

  header: { alignItems: "center", marginBottom: 28, gap: 12 },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 26, letterSpacing: -0.5, textAlign: "center" },
  subtitle: { fontSize: 14, lineHeight: 20, textAlign: "center", maxWidth: 280 },

  formatCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  formatTitle: { fontSize: 14 },
  codeBlock: {
    borderRadius: 10,
    padding: 12,
  },
  code: { fontSize: 12, lineHeight: 20 },
  rulesList: { gap: 8 },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ruleText: { fontSize: 13, flex: 1 },

  resultCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 16,
  },
  resultTitle: { fontSize: 14 },
  resultSub: { fontSize: 12, marginTop: 2 },

  pickBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  pickBtnText: { fontSize: 16, color: "#fff" },

  hint: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
