import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
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
import { askAi } from "@/services/api";

const LANGUAGES = [
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "so", label: "Somali", flag: "🇸🇴" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
  { code: "ti", label: "Tigrinya", flag: "🇪🇷" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export default function TranslateScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const canTranslate = text.trim().length > 10 && !loading;

  const handleTranslate = async () => {
    if (!canTranslate) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError("");
    setResult("");
    try {
      const message = `Przetłumacz poniższy tekst z języka szwedzkiego na ${selectedLang.label}. Zachowaj formalny, urzędowy styl. Zwróć tylko przetłumaczony tekst bez żadnych komentarzy.\n\n${text.trim()}`;
      const data = await askAi(message);
      setResult(data.reply);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      setError(e?.message || "Błąd tłumaczenia. Spróbuj ponownie.");
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: theme.textSecondary }]}>Tekst do przetłumaczenia (po szwedzku)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text }]}
          placeholder="Wklej lub wpisz tekst ze szwedzkiego urzędu..."
          placeholderTextColor={theme.textTertiary}
          multiline
          value={text}
          onChangeText={setText}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Przetłumacz na:</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => setSelectedLang(lang)}
              style={[
                styles.langBtn,
                { backgroundColor: theme.card, borderColor: selectedLang.code === lang.code ? Colors.primary : theme.cardBorder },
                selectedLang.code === lang.code && { backgroundColor: Colors.primary + "12" },
              ]}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.langLabel, { color: selectedLang.code === lang.code ? Colors.primary : theme.text }]}>
                {lang.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleTranslate}
          disabled={!canTranslate}
          style={[styles.btn, { backgroundColor: canTranslate ? Colors.primary : theme.cardBorder }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Feather name="globe" size={16} color="#fff" />
              <Text style={styles.btnText}>Przetłumacz</Text>
            </>
          )}
        </Pressable>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.danger + "15" }]}>
            <Feather name="alert-circle" size={15} color={theme.danger} />
            <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
          </View>
        ) : null}

        {result ? (
          <View style={[styles.resultBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.resultHeader}>
              <Text style={[styles.resultLabel, { color: Colors.primary }]}>
                {selectedLang.flag} Tłumaczenie ({selectedLang.label})
              </Text>
              <Pressable onPress={handleCopy} style={[styles.copyBtn, { backgroundColor: copied ? theme.success + "20" : Colors.primary + "12" }]}>
                <Feather name={copied ? "check" : "copy"} size={13} color={copied ? theme.success : Colors.primary} />
                <Text style={[styles.copyBtnText, { color: copied ? theme.success : Colors.primary }]}>
                  {copied ? "Kopierat" : "Kopiera"}
                </Text>
              </Pressable>
            </View>
            <Text style={[styles.resultText, { color: theme.text }]}>{result}</Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  label: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 21, minHeight: 120 },
  langGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  langBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  langFlag: { fontSize: 16 },
  langLabel: { fontSize: 13, fontWeight: "500" },
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12, marginTop: 4 },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10 },
  errorText: { fontSize: 13, flex: 1 },
  resultBox: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 10 },
  resultHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resultLabel: { fontSize: 13, fontWeight: "700" },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  copyBtnText: { fontSize: 12, fontWeight: "600" },
  resultText: { fontSize: 14, lineHeight: 22 },
});
