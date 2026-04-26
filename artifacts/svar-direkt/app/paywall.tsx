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
  { icon: "cpu", title: "AI Generator listów", desc: "Generuj profesjonalne pisma do urzędów" },
  { icon: "clock", title: "Historia generowanych pism", desc: "Wszystkie Twoje wygenerowane teksty" },
  { icon: "shield", title: "Försvar – obrona prawna", desc: "Pomoc przy obronie przed urzędami" },
  { icon: "bell", title: "Påminnelser – przypomnienia", desc: "Nigdy nie przegap terminu" },
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
      Alert.alert("Błąd", e?.message || "Nie udało się otworzyć płatności");
    } finally {
      setBusy(false);
    }
  }

  const alreadyTrial = !!(user?.trialEndsAt && user.trialEndsAt < Date.now());

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
          Pełen dostęp do wszystkich funkcji
        </Text>
      </View>

      <View style={[styles.priceCard, { backgroundColor: theme.card, borderColor: Colors.primary }]}>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.text }]}>79 SEK</Text>
          <Text style={[styles.priceUnit, { color: theme.textSecondary }]}>/miesiąc</Text>
        </View>
        {!alreadyTrial && (
          <View style={[styles.trialBadge, { backgroundColor: Colors.primary }]}>
            <Feather name="gift" size={14} color="#fff" />
            <Text style={styles.trialText}>7 dni za darmo</Text>
          </View>
        )}
        <Text style={[styles.priceNote, { color: theme.textTertiary }]}>
          Anuluj kiedy chcesz · Bez zobowiązań
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
              {!isAuthenticated
                ? "Załóż konto i rozpocznij"
                : alreadyTrial
                ? "Subskrybuj 79 SEK/mc"
                : "Rozpocznij 7-dniowy okres próbny"}
            </Text>
          </>
        )}
      </Pressable>

      {!isAuthenticated && (
        <Pressable
          onPress={() => router.push({ pathname: "/auth", params: { redirect: "/paywall" } })}
          style={styles.linkBtn}
        >
          <Text style={[styles.linkText, { color: Colors.primary }]}>Mam już konto – zaloguj się</Text>
        </Pressable>
      )}

      <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
        Płatność za pomocą karty obsługiwana przez Stripe.{"\n"}
        Subskrypcja odnawia się automatycznie co miesiąc.{"\n"}
        Po okresie próbnym zostaniesz obciążony 79 SEK – możesz anulować w dowolnym momencie w profilu.
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
  trialBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 10,
  },
  trialText: { color: "#fff", fontSize: 13, fontWeight: "600" },
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
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    paddingVertical: 16, borderRadius: 14, marginTop: 4,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  linkBtn: { alignItems: "center", paddingVertical: 8 },
  linkText: { fontSize: 14, fontWeight: "500" },
  disclaimer: { fontSize: 11, textAlign: "center", lineHeight: 16, marginTop: 8 },
});
