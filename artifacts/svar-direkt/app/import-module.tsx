import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { InstalledModule, ModuleData, useApp } from "@/contexts/AppContext";

function validate(data: unknown): data is ModuleData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (typeof d.version !== "number") return false;
  if (typeof d.name !== "string" || !d.name.trim()) return false;
  if (d.quickResponses !== undefined && !Array.isArray(d.quickResponses)) return false;
  if (d.customTemplates !== undefined && !Array.isArray(d.customTemplates)) return false;
  return true;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" });
}

function ModuleCard({
  mod,
  onRemove,
  theme,
}: {
  mod: InstalledModule;
  onRemove: () => void;
  theme: (typeof Colors)["light"];
}) {
  const total = mod.quickResponseIds.length + mod.templateIds.length;
  return (
    <View style={[styles.modCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={[styles.modIconWrap, { backgroundColor: Colors.primary + "15" }]}>
        <Feather name="package" size={20} color={Colors.primary} />
      </View>
      <View style={styles.modInfo}>
        <Text style={[styles.modName, { color: theme.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={1}>
          {mod.name}
        </Text>
        <Text style={[styles.modMeta, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          {mod.quickResponseIds.length > 0 && `${mod.quickResponseIds.length} snabba svar`}
          {mod.quickResponseIds.length > 0 && mod.templateIds.length > 0 && "  ·  "}
          {mod.templateIds.length > 0 && `${mod.templateIds.length} mallar`}
          {total === 0 && "Tom modul"}
          {"  ·  "}
          {formatDate(mod.importedAt)}
        </Text>
      </View>
      <Pressable
        onPress={onRemove}
        hitSlop={12}
        style={({ pressed }) => [styles.removeBtn, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Feather name="trash-2" size={18} color="#e17055" />
      </Pressable>
    </View>
  );
}

export default function ImportModuleScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { importModule, removeModule, installedModules } = useApp();
  const [loading, setLoading] = useState(false);
  const [showFormat, setShowFormat] = useState(false);

  const handleRemove = (mod: InstalledModule) => {
    Alert.alert(
      "Ta bort modul",
      `Vill du ta bort "${mod.name}"?\n\n${mod.quickResponseIds.length} snabba svar och ${mod.templateIds.length} mallar tas bort. Grundinnehållet i appen påverkas inte.`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Ta bort",
          style: "destructive",
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await removeModule(mod.id);
          },
        },
      ]
    );
  };

  const handlePick = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const picked = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (picked.canceled || !picked.assets?.length) return;

      setLoading(true);
      const file = picked.assets[0];

      const name = (file.name ?? "").toLowerCase();
      if (!name.endsWith(".json") && !name.endsWith(".zip")) {
        Alert.alert(
          "Fel filtyp",
          "Välj en .json-fil (eller .zip som innehåller en modul).\n\nKameran och bilder stöds inte här."
        );
        setLoading(false);
        return;
      }

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
      const total = result.addedQuickResponses + result.addedTemplates;

      if (total === 0) {
        Alert.alert("Modul inläst", "Inga nya poster hittades — allt finns redan installerat.");
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "Modul installerad",
          `"${data.name}" är nu installerad.\n\n• ${result.addedQuickResponses} snabba svar\n• ${result.addedTemplates} mallar`
        );
      }
    } catch {
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
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 48 },
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
          <Feather name="package" size={30} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
          Moduler
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Importera och hantera datapaket med snabba svar och mallar.
        </Text>
      </View>

      {/* Installed modules */}
      <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
        INSTALLERADE MODULER
      </Text>

      {installedModules.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Feather name="inbox" size={28} color={theme.textTertiary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Inga moduler installerade ännu.{"\n"}Importera din första modul nedan.
          </Text>
        </View>
      ) : (
        <View style={styles.modList}>
          {installedModules.map((mod) => (
            <ModuleCard key={mod.id} mod={mod} onRemove={() => handleRemove(mod)} theme={theme} />
          ))}
        </View>
      )}

      {/* Import section */}
      <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold", marginTop: 28 }]}>
        IMPORTERA NY MODUL
      </Text>

      {/* Format reference – collapsible */}
      <Pressable
        onPress={() => setShowFormat((v) => !v)}
        style={[styles.formatToggle, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      >
        <Text style={[styles.formatToggleLabel, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
          Modulformat (JSON)
        </Text>
        <Feather name={showFormat ? "chevron-up" : "chevron-down"} size={16} color={theme.textSecondary} />
      </Pressable>

      {showFormat && (
        <View style={[styles.formatCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={[styles.codeBlock, { backgroundColor: theme.backgroundSecondary ?? theme.background }]}>
            <Text style={[styles.code, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {`{\n  "version": 1,\n  "name": "Modulnamn",\n  "quickResponses": [\n    { "id": "q1", "title": "...", "content": "..." }\n  ],\n  "customTemplates": [\n    { "id": "t1", "title": "...",\n      "category": "...", "content": "..." }\n  ]\n}`}
            </Text>
          </View>
          <View style={styles.rulesList}>
            {[
              "Befintliga poster skrivs inte över",
              "Dubbletter (samma ID eller titel) ignoreras",
              "Fungerar helt offline",
              "Moduler kan tas bort separat",
            ].map((rule) => (
              <View key={rule} style={styles.ruleRow}>
                <Feather name="check-circle" size={13} color={Colors.primary} />
                <Text style={[styles.ruleText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
                  {rule}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Pressable
        onPress={handlePick}
        disabled={loading}
        style={({ pressed }) => [
          styles.pickBtn,
          {
            backgroundColor: loading ? Colors.primary + "70" : Colors.primary,
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
        Filen läses lokalt. Ingen data skickas till internet.
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

  header: { alignItems: "center", marginBottom: 28, gap: 10 },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 26, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, lineHeight: 20, textAlign: "center", maxWidth: 280 },

  sectionLabel: { fontSize: 11, letterSpacing: 0.8, marginBottom: 10 },

  emptyCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 28,
    alignItems: "center",
    gap: 10,
  },
  emptyText: { fontSize: 13, lineHeight: 20, textAlign: "center" },

  modList: { gap: 10 },
  modCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 12,
  },
  modIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modInfo: { flex: 1, gap: 3 },
  modName: { fontSize: 14 },
  modMeta: { fontSize: 12, lineHeight: 16 },
  removeBtn: { padding: 4 },

  formatToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 2,
  },
  formatToggleLabel: { fontSize: 14 },

  formatCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  codeBlock: { borderRadius: 10, padding: 12 },
  code: { fontSize: 11, lineHeight: 19 },
  rulesList: { gap: 7 },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ruleText: { fontSize: 12, flex: 1 },

  pickBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: 14,
  },
  pickBtnText: { fontSize: 16, color: "#fff" },

  hint: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
