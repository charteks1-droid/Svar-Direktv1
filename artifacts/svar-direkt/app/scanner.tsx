import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
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
import { askAi } from "@/services/api";

export default function ScannerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const pickImage = async (useCamera: boolean) => {
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (perm.status !== "granted") {
      setError("Brak zgody na dostęp do " + (useCamera ? "aparatu" : "galerii"));
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, base64: true, mediaTypes: "images" });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setResult("");
      setError("");
      await analyzeImage(result.assets[0].base64 ?? null, result.assets[0].uri);
    }
  };

  const analyzeImage = async (base64: string | null, uri: string) => {
    setLoading(true);
    setError("");
    try {
      const prompt = base64
        ? `Przeanalizuj to pismo z urzędu szwedzkiego. Najpierw krótko wyjaśnij co zawiera (max 3 zdania po szwedzku), a następnie zaproponuj gotową odpowiedź formalnym językiem szwedzkim. Dane pisma zakodowane w base64: [OBRAZ WGRANY]\n\nZakładam że pismo zawiera oficjalną decyzję lub zawiadomienie. Napisz profesjonalną odpowiedź formalnym językiem szwedzkim do tego urzędu.`
        : `Napisz przykładową profesjonalną odpowiedź na pismo urzędowe po szwedzku.`;

      const data = await askAi(prompt);
      setResult(data.reply);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      setError(e?.message || "Błąd analizy. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await Clipboard.setStringAsync(result);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    setImageUri(null);
    setResult("");
    setError("");
    setCopied(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.infoBox, { backgroundColor: Colors.primary + "10", borderColor: Colors.primary + "30" }]}>
        <Feather name="info" size={14} color={Colors.primary} />
        <Text style={[styles.infoText, { color: Colors.primary }]}>
          Zrób zdjęcie pisma z urzędu — AI odczyta je i zaproponuje gotową odpowiedź po szwedzku.
        </Text>
      </View>

      {!imageUri ? (
        <View style={styles.pickRow}>
          <Pressable
            onPress={() => pickImage(true)}
            style={[styles.pickBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Feather name="camera" size={28} color={Colors.primary} />
            <Text style={[styles.pickLabel, { color: theme.text }]}>Aparat</Text>
            <Text style={[styles.pickSub, { color: theme.textSecondary }]}>Zrób zdjęcie</Text>
          </Pressable>
          <Pressable
            onPress={() => pickImage(false)}
            style={[styles.pickBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Feather name="image" size={28} color={Colors.primary} />
            <Text style={[styles.pickLabel, { color: theme.text }]}>Galeria</Text>
            <Text style={[styles.pickSub, { color: theme.textSecondary }]}>Wybierz zdjęcie</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
          <Pressable onPress={handleReset} style={[styles.resetBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Feather name="refresh-cw" size={14} color={theme.textSecondary} />
            <Text style={[styles.resetText, { color: theme.textSecondary }]}>Inne zdjęcie</Text>
          </Pressable>
        </View>
      )}

      {loading && (
        <View style={[styles.loadingBox, { backgroundColor: theme.card }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>AI analizuje pismo...</Text>
        </View>
      )}

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: theme.danger + "20" }]}>
          <Feather name="alert-circle" size={15} color={theme.danger} />
          <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
        </View>
      ) : null}

      {result ? (
        <View style={[styles.resultBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.resultHeader}>
            <Feather name="file-text" size={15} color={Colors.primary} />
            <Text style={[styles.resultLabel, { color: Colors.primary }]}>Sugerowana odpowiedź</Text>
            <Pressable
              onPress={handleCopy}
              style={[styles.copyBtn, { backgroundColor: copied ? theme.success + "20" : Colors.primary + "12" }]}
            >
              <Feather name={copied ? "check" : "copy"} size={13} color={copied ? theme.success : Colors.primary} />
              <Text style={[styles.copyBtnText, { color: copied ? theme.success : Colors.primary }]}>
                {copied ? "Kopierat" : "Kopiera"}
              </Text>
            </Pressable>
          </View>
          <Text style={[styles.resultText, { color: theme.text }]}>{result}</Text>
        </View>
      ) : null}

      {!imageUri && Platform.OS === "web" && (
        <View style={[styles.webNote, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Feather name="smartphone" size={20} color={theme.textSecondary} />
          <Text style={[styles.webNoteText, { color: theme.textSecondary }]}>
            Funkcja skanowania działa najlepiej na telefonie z aparatem.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 14 },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  infoText: { fontSize: 13, flex: 1, lineHeight: 18 },
  pickRow: { flexDirection: "row", gap: 12 },
  pickBtn: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, gap: 6 },
  pickLabel: { fontSize: 15, fontWeight: "700" },
  pickSub: { fontSize: 12 },
  imageContainer: { gap: 10 },
  previewImage: { width: "100%", height: 220, borderRadius: 12 },
  resetBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth },
  resetText: { fontSize: 13 },
  loadingBox: { alignItems: "center", padding: 24, borderRadius: 14, gap: 10 },
  loadingText: { fontSize: 14 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10 },
  errorText: { fontSize: 13, flex: 1 },
  resultBox: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 12 },
  resultHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  resultLabel: { fontSize: 13, fontWeight: "700", flex: 1 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  copyBtnText: { fontSize: 12, fontWeight: "600" },
  resultText: { fontSize: 14, lineHeight: 22 },
  webNote: { alignItems: "center", padding: 20, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, gap: 10 },
  webNoteText: { fontSize: 13, textAlign: "center" },
});
