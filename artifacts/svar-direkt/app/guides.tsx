import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
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
import { APP_CONFIG } from "@/constants/config";

const GUIDES_KEY = "guides_v2";

interface Guide {
  id: string;
  name: string;
  localUri: string;
  serverUrl: string;
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
  const hasServer = !!guide.serverUrl;

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
        <View style={styles.cardMetaRow}>
          <Text style={[styles.cardMeta, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            {guide.sizeBytes > 0 ? formatBytes(guide.sizeBytes) : "PDF"}
            {"  ·  "}
            {formatDate(guide.addedAt)}
          </Text>
          <View style={[
            styles.statusDot,
            { backgroundColor: hasServer ? "#00b894" + "25" : "#fdcb6e" + "25" },
          ]}>
            <Feather
              name={hasServer ? "cloud" : "smartphone"}
              size={10}
              color={hasServer ? "#00b894" : "#fdcb6e"}
            />
            <Text style={[styles.statusText, { color: hasServer ? "#00b894" : "#fdcb6e", fontFamily: "Inter_500Medium" }]}>
              {hasServer ? "Synkad" : "Lokal"}
            </Text>
          </View>
        </View>
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

async function uploadToServer(localUri: string, fileName: string): Promise<string> {
  const serverBase = APP_CONFIG.apiBaseUrl.replace(/\/api\/?$/, "");
  const uploadUrl = `${APP_CONFIG.apiBaseUrl}/uploads/pdf`;

  const formData = new FormData();
  formData.append("file", { uri: localUri, type: "application/pdf", name: fileName } as any);

  const resp = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.status.toString());
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const json = await resp.json();
  return `${serverBase}${json.url}`;
}

export default function GuidesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const loadGuides = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(GUIDES_KEY);
      if (raw) {
        const parsed: Guide[] = JSON.parse(raw);
        const fixed = parsed.map((g) => ({
          ...g,
          serverUrl:
            g.serverUrl && g.serverUrl.includes("/uploads/") && !g.serverUrl.includes("/api/uploads/")
              ? g.serverUrl.replace("/uploads/", "/api/uploads/")
              : g.serverUrl,
        }));
        setGuides(fixed);
        await AsyncStorage.setItem(GUIDES_KEY, JSON.stringify(fixed));
        return;
      }
      const oldRaw = await AsyncStorage.getItem("guides_v1");
      if (oldRaw) {
        const oldGuides: Array<{ id: string; name: string; fileUri: string; addedAt: string; sizeBytes: number }> =
          JSON.parse(oldRaw);
        const migrated: Guide[] = oldGuides.map((g) => ({
          id: g.id,
          name: g.name,
          localUri: "",
          serverUrl: g.fileUri ?? "",
          addedAt: g.addedAt,
          sizeBytes: g.sizeBytes ?? 0,
        }));
        await AsyncStorage.setItem(GUIDES_KEY, JSON.stringify(migrated));
        setGuides(migrated);
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
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (picked.canceled || !picked.assets?.length) return;

      setLoading(true);
      const file = picked.assets[0];
      const fileName = file.name ?? `guide_${Date.now()}.pdf`;
      const localUri = file.uri;

      const newGuide: Guide = {
        id: Date.now().toString(),
        name: fileName.replace(/\.[^.]+$/, ""),
        localUri,
        serverUrl: "",
        addedAt: new Date().toISOString(),
        sizeBytes: file.size ?? 0,
      };

      const updated = [newGuide, ...guides];
      await saveGuides(updated);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("PDF importerad ✓", `"${newGuide.name}" har sparats.`);

      setUploadingId(newGuide.id);
      try {
        const serverUrl = await uploadToServer(localUri, fileName);
        const withServer = updated.map((g) =>
          g.id === newGuide.id ? { ...g, serverUrl } : g
        );
        await saveGuides(withServer);
      } catch {
      } finally {
        setUploadingId(null);
      }
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (!msg.toLowerCase().includes("cancel") && !msg.includes("aborted")) {
        Alert.alert("Fel vid import", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (guide: Guide) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (guide.serverUrl) {
        const ok = await Linking.canOpenURL(guide.serverUrl).catch(() => false);
        if (ok) {
          await Linking.openURL(guide.serverUrl);
          return;
        }
      }

      if (guide.localUri) {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(guide.localUri, {
            mimeType: "application/pdf",
            dialogTitle: guide.name,
            UTI: "com.adobe.pdf",
          });
          return;
        }

        const ok = await Linking.canOpenURL(guide.localUri).catch(() => false);
        if (ok) {
          await Linking.openURL(guide.localUri);
          return;
        }
      }

      Alert.alert(
        "Kan inte öppna PDF",
        "Ingen PDF-visare hittades på enheten. Installera en PDF-app och försök igen.",
      );
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (!msg.toLowerCase().includes("cancel")) {
        Alert.alert("Fel vid öppning", msg);
      }
    }
  };

  const handleDelete = (guide: Guide) => {
    Alert.alert(
      "Ta bort guide",
      `Vill du ta bort "${guide.name}"?\n\nOriginalfilen på telefonen påverkas inte.`,
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

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: insets.bottom + 48 },
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
          Importera PDF-filer från telefonen eller internet. Lokala filer öppnas direkt utan internet.
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
            <View key={g.id}>
              <GuideCard
                guide={g}
                onOpen={() => handleOpen(g)}
                onDelete={() => handleDelete(g)}
                theme={theme}
              />
              {uploadingId === g.id && (
                <Text style={[styles.uploadingText, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
                  Synkroniserar till moln…
                </Text>
              )}
            </View>
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
          {loading ? "Importerar…" : "Importera PDF"}
        </Text>
      </Pressable>

      <Text style={[styles.hint, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
        Välj PDF-filer från telefonen. Lokala filer fungerar offline. Med internet synkroniseras de till molnet.
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
  subtitle: { fontSize: 14, lineHeight: 20, textAlign: "center", maxWidth: 300 },

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
  cardMetaRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  cardMeta: { fontSize: 12 },
  statusDot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: { fontSize: 10 },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  uploadingText: {
    fontSize: 11,
    marginTop: 4,
    marginLeft: 14,
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
