import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  featureName: string;
  children: React.ReactNode;
}

export function PremiumGate({ featureName, children }: Props) {
  const { isAuthenticated, isPremium, initializing } = useAuth();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated || !isPremium) {
    }
  }, [initializing, isAuthenticated, isPremium]);

  if (initializing) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background, paddingTop: insets.top + 60, paddingHorizontal: 32 }]}>
        <View style={[styles.iconBox, { backgroundColor: Colors.primary + "18" }]}>
          <Feather name="user" size={32} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Wymagane logowanie</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          Aby korzystać z funkcji "{featureName}" musisz mieć konto.
        </Text>
        <Pressable
          onPress={() => router.push({ pathname: "/auth", params: { mode: "register", redirect: "/paywall" } })}
          style={[styles.btn, { backgroundColor: Colors.primary }]}
        >
          <Text style={styles.btnText}>Załóż konto · 7 dni gratis</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: "/auth", params: { mode: "login" } })}
          style={[styles.btnGhost]}
        >
          <Text style={[styles.btnGhostText, { color: Colors.primary }]}>Mam już konto</Text>
        </Pressable>
      </View>
    );
  }

  if (!isPremium) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background, paddingTop: insets.top + 60, paddingHorizontal: 32 }]}>
        <View style={[styles.iconBox, { backgroundColor: Colors.primary + "18" }]}>
          <Feather name="star" size={32} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Funkcja Premium</Text>
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          "{featureName}" jest dostępne tylko w planie Premium (79 SEK/mc, 7 dni gratis).
        </Text>
        <Pressable
          onPress={() => router.push("/paywall")}
          style={[styles.btn, { backgroundColor: Colors.primary }]}
        >
          <Text style={styles.btnText}>Aktywuj Premium</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.btnGhost}>
          <Text style={[styles.btnGhostText, { color: theme.textSecondary }]}>← Wróć</Text>
        </Pressable>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "flex-start", gap: 12 },
  iconBox: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  text: { fontSize: 15, textAlign: "center", lineHeight: 21, marginBottom: 8 },
  btn: {
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12,
    alignItems: "center", marginTop: 8, minWidth: 240,
  },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  btnGhost: { paddingVertical: 12, alignItems: "center" },
  btnGhostText: { fontSize: 14, fontWeight: "500" },
});
