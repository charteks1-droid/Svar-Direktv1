import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function AuthScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { login, register } = useAuth();
  const params = useLocalSearchParams<{ mode?: string; redirect?: string }>();

  const [mode, setMode] = useState<"login" | "register">(
    params.mode === "register" ? "register" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    if (!email.trim() || !password) {
      setError("Wpisz email i hasło");
      return;
    }
    if (mode === "register" && password !== password2) {
      setError("Hasła nie są takie same");
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password);
      }
      const redirect = params.redirect;
      if (redirect && typeof redirect === "string") {
        router.replace(redirect as any);
      } else {
        router.replace("/(tabs)");
      }
    } catch (e: any) {
      setError(e?.message || "Błąd logowania");
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: Colors.primary }]}>
            <Feather name="shield" size={36} color="#fff" />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Svar Direkt</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {mode === "login" ? "Zaloguj się do konta" : "Utwórz nowe konto"}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="twoj@email.com"
            placeholderTextColor={theme.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.background }]}
            editable={!busy}
          />

          <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>Hasło</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="min. 6 znaków"
            placeholderTextColor={theme.textTertiary}
            secureTextEntry
            autoCapitalize="none"
            style={[styles.input, { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.background }]}
            editable={!busy}
          />

          {mode === "register" && (
            <>
              <Text style={[styles.label, { color: theme.textSecondary, marginTop: 14 }]}>
                Powtórz hasło
              </Text>
              <TextInput
                value={password2}
                onChangeText={setPassword2}
                placeholder="powtórz hasło"
                placeholderTextColor={theme.textTertiary}
                secureTextEntry
                autoCapitalize="none"
                style={[styles.input, { color: theme.text, borderColor: theme.cardBorder, backgroundColor: theme.background }]}
                editable={!busy}
              />
            </>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={14} color="#fff" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            onPress={submit}
            disabled={busy}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: Colors.primary, opacity: busy || pressed ? 0.85 : 1 },
            ]}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {mode === "login" ? "Zaloguj się" : "Utwórz konto"}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setError(null);
              setMode(mode === "login" ? "register" : "login");
            }}
            style={styles.switchBtn}
            disabled={busy}
          >
            <Text style={[styles.switchText, { color: Colors.primary }]}>
              {mode === "login"
                ? "Nie masz konta? Zarejestruj się"
                : "Masz już konto? Zaloguj się"}
            </Text>
          </Pressable>
        </View>

        {mode === "register" && (
          <View style={[styles.infoBox, { backgroundColor: theme.backgroundTertiary, borderColor: theme.cardBorder }]}>
            <Feather name="info" size={16} color={Colors.primary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Po rejestracji masz 7 dni darmowego okresu próbnego Premium. Anuluj kiedy chcesz.
            </Text>
          </View>
        )}

        <Pressable onPress={() => router.back()} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: theme.textTertiary }]}>← Wróć</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 16 },
  header: { alignItems: "center", marginBottom: 12 },
  logo: {
    width: 80, height: 80, borderRadius: 20,
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 15 },
  card: {
    borderRadius: 16, borderWidth: 1, padding: 20,
  },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 6 },
  input: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16,
  },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#e53e3e", paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 10, marginTop: 14,
  },
  errorText: { color: "#fff", fontSize: 13, flex: 1 },
  primaryBtn: {
    marginTop: 18, paddingVertical: 14, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  switchBtn: { marginTop: 14, alignItems: "center", paddingVertical: 8 },
  switchText: { fontSize: 14, fontWeight: "500" },
  infoBox: {
    flexDirection: "row", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1,
    alignItems: "flex-start",
  },
  infoText: { fontSize: 13, flex: 1, lineHeight: 18 },
  skipBtn: { alignItems: "center", paddingVertical: 12, marginTop: 8 },
  skipText: { fontSize: 14 },
});
