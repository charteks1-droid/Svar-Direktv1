import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { subscriptionApi } from "@/services/api";

const FEATURES = [
  { icon: "cpu", title: "Obegränsad AI-generator", desc: "Skapa professionella brev till myndigheter utan gräns" },
  { icon: "clock", title: "Sparad brevhistorik", desc: "Alla dina genererade brev på ett ställe" },
  { icon: "file-text", title: "Mallar för alla ärenden", desc: "Färdiga mallar för vanliga myndighetskontakter" },
  { icon: "bell", title: "Påminnelser om deadlines", desc: "Missa aldrig ett viktigt datum" },
];

export default function PaywallScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, refreshSubscription } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sub = Linking.addEventListener("url", async ({ url }) => {
      if (url.includes("subscription/success") || url.includes("subscription/cancel")) {
        await refreshSubscription();
        if (url.includes("success")) {
          router.replace("/(tabs)");
        }
      }
    });
    return () => sub.remove();
  }, [refreshSubscription]);

  async function startSubscription() {
    if (!isAuthenticated) {
      router.push({ pathname: "/auth", params: { mode: "register", redirect: "/paywall" } });
      return;
    }
    setBusy(true);
    try {
      const successUrl = Linking.createURL("subscription/success");
      const cancelUrl = Linking.createURL("subscription/cancel");
      const { url } = await subscriptionApi.checkout(successUrl, cancelUrl);
      const result = await WebBrowser.openAuthSessionAsync(url, successUrl);
      if (result.type === "success" || result.type === "dismiss") {
        await refreshSubscription();
      }
    } catch (e: any) {
      Alert.alert("Fel", e?.message || "Det gick inte att öppna betalningssidan. Försök igen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Pressable onPress={() => router.back()} style={styles.closeBtn}>
        <Feather name="x" size={24} color={theme.textSecondary} />
      </Pressable>

      <View style={styles.header}>
        <View style={[styles.crown, { backgroundColor: Colors.primary }]}>
          <Feather name="star" size={36} color="#fff" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Svar Direkt Premium</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Full tillgång till alla funktioner
        </Text>
      </View>

      <View style={[styles.priceCard, { backgroundColor: theme.card, borderColor: Colors.primary }]}>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.text }]}>79 kr</Text>
          <Text style={[styles.priceUnit, { color: theme.textSecondary }]}>/mån</Text>
        </View>
        <Text style={[styles.priceNote, { color: theme.textTertiary }]}>
          Avsluta när du vill · Inga bindningstider
        </Text>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f) => (
          <View
            key={f.title}
            style={[styles.featureRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <View style={[styles.featureIcon, { backgroundColor: Colors.primary + "18" }]}>
              <Feather name={f.icon as any} size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>{f.title}</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>{f.desc}</Text>
            </View>
            <Feather name="check-circle" size={20} color={Colors.primary} />
          </View>
        ))}
      </View>

      <Pressable
        onPress={startSubscription}
        disabled={busy}
        style={({ pressed }) => [
          styles.ctaBtn,
          { backgroundColor: Colors.primary, opacity: busy || pressed ? 0.85 : 1 },
        ]}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Feather name="credit-card" size={20} color="#fff" />
            <Text style={styles.ctaText}>
              {!isAuthenticated ? "Skapa konto och prenumerera" : "Prenumerera nu — 79 kr/mån"}
            </Text>
          </>
        )}
      </Pressable>

      {!isAuthenticated && (
        <Pressable
          onPress={() => router.push({ pathname: "/auth", params: { redirect: "/paywall" } })}
          style={styles.linkBtn}
        >
          <Text style={[styles.linkText, { color: Colors.primary }]}>Har redan konto – logga in</Text>
        </Pressable>
      )}

      <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
        Betalning med kort via Stripe.{"\n"}
        Prenumerationen förnyas automatiskt varje månad för 79 kr.{"\n"}
        Du kan avsluta när som helst via din profil.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 18 },
  closeBtn: { alignSelf: "flex-end", padding: 8 },
  header: { alignItems: "center", marginVertical: 8 },
  crown: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 15 },
  priceCard: {
    borderRadius: 16, borderWidth: 2, padding: 20, alignItems: "center",
  },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  price: { fontSize: 40, fontWeight: "700" },
  priceUnit: { fontSize: 16 },
  priceNote: { fontSize: 12, marginTop: 8 },
  features: { gap: 10 },
  featureRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderRadius: 12, borderWidth: 1,
  },
  featureIcon: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  featureTitle: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  featureDesc: { fontSize: 13 },
  ctaBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 16, borderRadius: 14,
  },
  ctaText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  linkBtn: { alignItems: "center", paddingVertical: 8 },
  linkText: { fontSize: 14, fontWeight: "600" },
  disclaimer: { fontSize: 11, textAlign: "center", lineHeight: 18 },
});
