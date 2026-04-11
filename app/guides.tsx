import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "@/constants/colors";

const GUIDES_KEY = "guides_v1";

interface Guide {
  id: string;
  name: string;
  fileUri: string;
  addedAt: string;
  sizeBytes: number;
}


function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function GuideCard({
  guide,
  onOpen,
  onDelete,
  theme,
}: {
  guide: Guide;
  onOpen: () => void;
  onDelete: () => void;
  theme: (typeof Colors)["light"];
}) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={[styles.cardIcon, { backgroundColor: "#e17055" + "18" }]}>
        <Feather name="file-text" size={22} color="#e17055" />
      </View>
      <View style={styles.cardInfo}>
        <Text
          style={[styles.cardName, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
          numberOfLines={2}
        >
          {guide.name}
        </Text>
        <Text style={[styles.cardMeta, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          {guide.sizeBytes > 0 ? formatBytes(guide.sizeBytes) : "PDF"}
          {"  ·  "}
          {formatDate(guide.addedAt)}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <Pressable
          onPress={onOpen}
          hitSlop={10}
          style={({ pressed }) => [
            styles.actionBtn,
            { opacity: pressed ? 0.6 : 1, backgroundColor: Colors.primary + "15" },
          ]}
        >
          <Feather name="external-link" size={17} color={Colors.primary} />
        </Pressable>
        <Pressable
          onPress={onDelete}
          hitSlop={10}
          style={({ pressed }) => [
            styles.actionBtn,
            { opacity: pressed ? 0.6 : 1, backgroundColor: "#e17055" + "15" },
          ]}
        >
          <Feather name="trash-2" size={17} color="#e17055" />
        </Pressable>
      </View>
    </View>
  );
}

export default function GuidesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGuides = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(GUIDES_KEY);
      if (!raw) return;
      setGuides(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  const saveGuides = async (updated: Guide[]) => {
    setGuides(updated);
    await AsyncStorage.setItem(GUIDES_KEY, JSON.stringify(updated));
  };

  const handleImport = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const picked = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (picked.canceled || !picked.assets?.length) return;

      setLoading(true);
      const file = picked.assets[0];
      const fileName = file.name ?? `guide_${Date.now()}.pdf`;

      const newGuide: Guide = {
        id: Date.now().toString(),
        name: fileName.replace(/\.[^.]+$/, ""),
        fileUri: file.uri,
        addedAt: new Date().toISOString(),
        sizeBytes: file.size ?? 0,
      };

      await saveGuides([newGuide, ...guides]);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("PDF sparad ✓", `"${newGuide.name}" har sparats i appen.`);
    } catch (e: any) {
      if (!String(e?.message).includes("cancel")) {
        Alert.alert("Fel", `Oväntat fel vid filval:\n${e?.message ?? e}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (guide: Guide) => {
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert("Kan inte öppna", "Din telefon stöder inte delning av filer.");
        return;
      }
      await Sharing.shareAsync(guide.fileUri, {
        mimeType: "application/pdf",
        dialogTitle: guide.name,
        UTI: "com.adobe.pdf",
      });
    } catch (e: any) {
      Alert.alert("Kunde inte öppna PDF", `Fel: ${e?.message ?? e}`);
    }
  };

  const handleDelete = (guide: Guide) => {
    Alert.alert(
      "Ta bort guide",
      `Vill du ta bort "${guide.name}" från appen?\n\nOriginalfilen på telefonen påverkas inte.`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Ta bort",
          style: "destructive",
          onPress: async () => {
            const updated = guides.filter((g) => g.id !== guide.id);
            await saveGuides(updated);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
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
        <View style={[styles.headerIcon, { backgroundColor: "#e17055" + "18" }]}>
          <Feather name="book-open" size={30} color="#e17055" />
        </View>
        <Text style={[styles.title, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
          PDF-guider
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Spara PDF-guider lokalt i appen för snabb åtkomst, även utan internet.
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
        SPARADE GUIDER ({guides.length})
      </Text>

      {guides.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Feather name="inbox" size={28} color={theme.textTertiary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Inga PDF-guider sparade ännu.{"\n"}Importera din första guide nedan.
          </Text>
        </View>
      ) : (
        <View style={styles.guideList}>
          {guides.map((g) => (
            <GuideCard
              key={g.id}
              guide={g}
              onOpen={() => handleOpen(g)}
              onDelete={() => handleDelete(g)}
              theme={theme}
            />
          ))}
        </View>
      )}

      <Pressable
        onPress={handleImport}
        disabled={loading}
        style={({ pressed }) => [
          styles.importBtn,
          {
            backgroundColor: loading ? "#e17055" + "70" : "#e17055",
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <Feather name={loading ? "loader" : "upload"} size={20} color="#fff" />
        <Text style={[styles.importBtnText, { fontFamily: "Inter_600SemiBold" }]}>
          {loading ? "Sparar…" : "Importera PDF"}
        </Text>
      </Pressable>

      <Text style={[styles.hint, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
        PDF-filer sparas lokalt i appen. Välj PDF-filer från din telefon.
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

  guideList: { gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1, gap: 4 },
  cardName: { fontSize: 14, lineHeight: 19 },
  cardMeta: { fontSize: 12 },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  importBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 14,
  },
  importBtnText: { fontSize: 16, color: "#fff" },
  hint: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
