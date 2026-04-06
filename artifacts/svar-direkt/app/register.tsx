import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isValid =
    email.includes("@") && password.length >= 8 && passwordsMatch;

  const handleRegister = async () => {
    if (!isValid || loading) return;
    if (!passwordsMatch) {
      Alert.alert("Lösenorden matchar inte", "Kontrollera att lösenorden är identiska.");
      return;
    }
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), password);
      router.back();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registreringen misslyckades.";
      Alert.alert("Registrering misslyckades", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <Feather name="arrow-left" size={20} color={theme.text} />
        </Pressable>

        {/* Header */}
        <View style={styles.headerSection}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.primary + "18" }]}>
            <Feather name="user-plus" size={28} color={Colors.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
            Skapa konto
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Skapa ett konto för att få tillgång till AI-assistenten. Gratis – 4 generationer per dag.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
              E-POSTADRESS
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, borderColor: theme.cardBorder, color: theme.text, fontFamily: "Inter_400Regular" }]}
              placeholder="din@epost.se"
              placeholderTextColor={theme.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
              LÖSENORD
            </Text>
            <View style={[styles.passwordWrapper, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <TextInput
                style={[styles.passwordInput, { color: theme.text, fontFamily: "Inter_400Regular" }]}
                placeholder="Minst 8 tecken"
                placeholderTextColor={theme.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                returnKeyType="next"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={theme.textSecondary} />
              </Pressable>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
              BEKRÄFTA LÖSENORD
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  borderColor: confirmPassword.length > 0 && !passwordsMatch ? "#e53e3e" : theme.cardBorder,
                  color: theme.text,
                  fontFamily: "Inter_400Regular",
                },
              ]}
              placeholder="Upprepa lösenordet"
              placeholderTextColor={theme.textTertiary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text style={[styles.errorText, { fontFamily: "Inter_400Regular" }]}>
                Lösenorden matchar inte.
              </Text>
            )}
          </View>

          <Pressable
            onPress={handleRegister}
            disabled={!isValid || loading}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: isValid ? Colors.primary : theme.cardBorder,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Feather name="user-plus" size={18} color="#fff" />
                <Text style={[styles.primaryBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                  Skapa konto
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Login link */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Har du redan ett konto?{" "}
          </Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text style={[styles.footerLink, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
              Logga in
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { paddingHorizontal: 20 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  headerSection: { alignItems: "center", marginBottom: 36, gap: 12 },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 26, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  form: { gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 11, letterSpacing: 0.6 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  passwordWrapper: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  passwordInput: { flex: 1, fontSize: 15 },
  eyeBtn: { padding: 4 },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  primaryBtnText: { color: "#fff", fontSize: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14 },
  errorText: { fontSize: 12, color: "#e53e3e" },
});
