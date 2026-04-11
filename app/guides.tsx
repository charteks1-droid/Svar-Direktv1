import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
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
const GUIDES_DIR = `${FileSystem.documentDirectory}guides/`;

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

async function ensureGuidesDir() {
  const info = await FileSystem.getInfoAsync(GUIDES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(GUIDES_DIR, { intermediates: true });
  }
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
          {formatBytes(guide.sizeBytes)}{"  ·  "}{formatDate(guide.addedAt)}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <Pressable
          onPress={onOpen}
          hitSlop={10}
          style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.6 : 1, backgroundColor: Colors.primary + "15" }]}
        >
          <Feather name="external-link" size={17} color={Colors.primary} />
        </Pressable>
        <Pressable
          onPress={onDelete}
          hitSlop={10}
          style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.6 : 1, backgroundColor: "#e17055" + "15" }]}
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
      if (raw) {
        const parsed: Guide[] = JSON.parse(raw);
        const valid: Guide[] = [];
        for (const g of parsed) {
          const info = await FileSystem.getInfoAsync(g.fileUri);
          if (info.exists) valid.push(g);
        }
        setGuides(valid);
        if (valid.length !== parsed.length) {
          await AsyncStorage.setItem(GUIDES_KEY, JSON.stringify(valid));
        }
      }
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
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (picked.canceled || !picked.assets?.length) return;

      const file = picked.assets[0];
      const fileName = (file.name ?? "").toLowerCase();

      if (!fileName.endsWith(".pdf")) {
        Alert.alert("Fel filtyp", "Välj en PDF-fil (.pdf).");
        return;
      }

      setLoading(true);

      await ensureGuidesDir();
      const destName = `guide_${Date.now()}.pdf`;
      const destUri = `${GUIDES_DIR}${destName}`;

      await FileSystem.copyAsync({ from: file.uri, to: destUri });

      const info = await FileSystem.getInfoAsync(destUri);
      const sizeBytes = info.exists && "size" in info ? (info as any).size : 0;

      const guide: Guide = {
        id: `guide_${Date.now()}`,
        name: file.name ?? destName,
        fileUri: destUri,
        addedAt: new Date().toISOString(),
        sizeBytes,
      };

      const updated = [guide, ...guides];
      await saveGuides(updated);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Guide tillagd", `"${guide.name}" har sparats i appen.`);
    } catch {
      Alert.alert("Fel", "Kunde inte importera PDF-filen. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (guide: Guide) => {
    try {
      const info = await FileSystem.getInfoAsync(guide.fileUri);
      if (!info.exists) {
        Alert.alert("Filen saknas", "PDF-filen hittades inte. Den kan ha tagits bort.");
        return;
      }

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Kan ej öppna", "Ingen app för att öppna PDF hittades på enheten.");
        return;
      }

      await Sharing.shareAsync(guide.fileUri, {
        mimeType: "application/pdf",
        dialogTitle: guide.name,
        UTI: "com.adobe.pdf",
      });
    } catch {
      Alert.alert("Fel", "Kunde inte öppna PDF-filen.");
    }
  };

  const handleDelete = (guide: Guide) => {
    Alert.alert(
      "Ta bort guide",
      `Vill du ta bort "${guide.name}"? Filen raderas permanent från appen.`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Ta bort",
          style: "destructive",
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            try {
              await FileSystem.deleteAsync(guide.fileUri, { idempotent: true });
            } catch {}
            const updated = guides.filter((g) => g.id !== guide.id);
            await saveGuides(updated);
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
          PDF Guider
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Spara PDF-guider lokalt och öppna dem när som helst – utan internet.
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
        SPARADE GUIDER
      </Text>

      {guides.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Feather name="inbox" size={28} color={theme.textTertiary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Inga guider sparade ännu.{"\n"}Importera din första PDF nedan.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
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

      <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold", marginTop: 28 }]}>
        IMPORTERA PDF
      </Text>

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
          {loading ? "Importerar…" : "Välj PDF-fil"}
        </Text>
      </Pressable>

      <Text style={[styles.hint, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
        Filen sparas lokalt i appen. Ingen data skickas till internet.{"\n"}Att öppna en guide kräver att du har en PDF-läsare installerad.
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

  list: { gap: 10 },

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
    flexShrink: 0,
  },
  cardInfo: { flex: 1, gap: 4 },
  cardName: { fontSize: 14, lineHeight: 20 },
  cardMeta: { fontSize: 12 },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 36,
    height: 36,
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
    marginTop: 4,
    marginBottom: 14,
  },
  importBtnText: { fontSize: 16, color: "#fff" },

  hint: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
