import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
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

function formatDate(ts: number | null) {
  if (!ts) return "-";
  return new Date(ts).toLocaleDateString("sv-SE", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function statusLabel(s: string) {
  switch (s) {
    case "owner": return "Ägare (livstid)";
    case "trialing": return "Provperiod";
    case "active": return "Aktiv";
    case "canceling": return "Avslutas vid periodens slut";
    case "past_due": return "Betalning försenad";
    case "canceled": return "Avslutad";
    case "incomplete": return "Ej slutförd";
    case "incomplete_expired": return "Utgången";
    default: return "Ingen prenumeration";
  }
}

export default function ProfileScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout, refreshSubscription } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background, paddingTop: insets.top + 60 }]}>
        <Feather name="user" size={48} color={theme.textTertiary} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>Inget konto</Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Logga in eller skapa ett konto för att använda Premium.
        </Text>
        <Pressable
          onPress={() => router.push("/auth")}
          style={[styles.primaryBtn, { backgroundColor: Colors.primary, marginTop: 20 }]}
        >
          <Text style={styles.primaryBtnText}>Logga in / Registrera</Text>
        </Pressable>
      </View>
    );
  }

  async function onRefresh() {
    setRefreshing(true);
    try {
      await refreshSubscription();
    } finally {
      setRefreshing(false);
    }
  }

  async function openPortal() {
    setBusy(true);
    try {
      const returnUrl = Linking.createURL("profile");
      const { url } = await subscriptionApi.portal(returnUrl);
      await WebBrowser.openAuthSessionAsync(url, returnUrl);
      await refreshSubscription();
    } catch (e: any) {
      Alert.alert("Fel", e?.message || "Kunde inte öppna Stripe-portalen. Försök igen.");
    } finally {
      setBusy(false);
    }
  }

  function confirmLogout() {
    Alert.alert("Logga ut", "Vill du verkligen logga ut?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Logga ut",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(tabs)");
        },
      },
    ]);
  }

  const isPremium = user.isPremium;
  const isOwner = user.isOwner;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
          <Text style={styles.avatarText}>{user.email[0].toUpperCase()}</Text>
        </View>
        <Text style={[styles.email, { color: theme.text }]}>{user.email}</Text>
        <Text style={[styles.joinDate, { color: theme.textTertiary }]}>
          Konto sedan {formatDate(user.createdAt)}
        </Text>
      </View>

      <View style={[styles.statusCard, {
        backgroundColor: theme.card,
        borderColor: isPremium ? Colors.primary : theme.cardBorder,
        borderWidth: isPremium ? 2 : 1,
      }]}>
        <View style={styles.statusHeader}>
          <Feather
            name={isPremium ? "star" : "lock"}
            size={20}
            color={isPremium ? Colors.primary : theme.textSecondary}
          />
          <Text style={[styles.statusTitle, { color: theme.text }]}>
            {isPremium ? "Premium aktiv" : "Inget Premium"}
          </Text>
        </View>
        <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>
          Status: {statusLabel(user.subscriptionStatus)}
        </Text>
        {isOwner && (
          <Text style={[styles.statusNote, { color: Colors.primary }]}>
            ⭐ Ägarkonto – full tillgång för alltid
          </Text>
        )}
        {!isOwner && user.currentPeriodEnd && (
          <Text style={[styles.statusNote, { color: theme.textSecondary }]}>
            Nästa betalning: {formatDate(user.currentPeriodEnd)}
          </Text>
        )}
        {!isOwner && !isPremium && typeof user.freeLettersRemaining === "number" && (
          <Text style={[styles.statusNote, { color: theme.textSecondary }]}>
            Gratis brev kvar: {user.freeLettersRemaining}/3
          </Text>
        )}

        {!isOwner && !isPremium && (
          <Pressable
            onPress={() => router.push("/paywall")}
            style={[styles.primaryBtn, { backgroundColor: Colors.primary, marginTop: 14 }]}
          >
            <Text style={styles.primaryBtnText}>Prenumerera — 79 kr/mån</Text>
          </Pressable>
        )}

        {!isOwner && isPremium && user.stripeCustomerId && (
          <Pressable
            onPress={openPortal}
            disabled={busy}
            style={[styles.secondaryBtn, { borderColor: Colors.primary, marginTop: 14 }]}
          >
            {busy ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <Text style={[styles.secondaryBtnText, { color: Colors.primary }]}>
                Hantera prenumeration
              </Text>
            )}
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={confirmLogout}
        style={[styles.logoutBtn, { borderColor: theme.cardBorder }]}
      >
        <Feather name="log-out" size={18} color={theme.textSecondary} />
        <Text style={[styles.logoutText, { color: theme.textSecondary }]}>Logga ut</Text>
      </Pressable>

      <Text style={[styles.copyright, { color: theme.textSecondary }]}>
        © Sebastian Charewicz · Svar Direkt · Alla rättigheter förbehållna
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "flex-start", paddingHorizontal: 32, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "600", marginTop: 12 },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  userCard: {
    borderRadius: 16, borderWidth: 1, padding: 20, alignItems: "center",
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 26, fontWeight: "700" },
  email: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  joinDate: { fontSize: 12 },
  statusCard: {
    borderRadius: 16, padding: 18,
  },
  statusHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  statusTitle: { fontSize: 17, fontWeight: "600" },
  statusLabel: { fontSize: 14, marginBottom: 6 },
  statusNote: { fontSize: 13, marginTop: 4 },
  primaryBtn: {
    paddingVertical: 13, borderRadius: 10, alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  secondaryBtn: {
    paddingVertical: 12, borderRadius: 10, alignItems: "center", borderWidth: 1.5,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: "600" },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 14, borderRadius: 12, borderWidth: 1,
  },
  logoutText: { fontSize: 15, fontWeight: "500" },
  copyright: { fontSize: 11, textAlign: "center", marginTop: 8, marginBottom: 4 },
});
