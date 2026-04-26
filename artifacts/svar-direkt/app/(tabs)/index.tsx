import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ARBETSFORMEDLINGEN_TEMPLATES, BOVERKET_TEMPLATES, FORSAKRINGSKASSAN_TEMPLATES, HYRESNAMND_TEMPLATES, KRONOFOGDEN_TEMPLATES, MIGRATIONSVERKET_TEMPLATES, PENSIONSMYNDIGHETEN_TEMPLATES, SKATTEVERKET_TEMPLATES, SOCIALTJANSTEN_TEMPLATES, TRANSPORTSTYRELSEN_TEMPLATES } from "@/data/situations";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  accent?: string;
}

function MenuItem({ icon, title, subtitle, onPress, accent }: MenuItemProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: (accent || Colors.primary) + "18" }]}>
        {icon}
      </View>
      <View style={styles.menuText}>
        <Text style={[styles.menuTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
          {title}
        </Text>
        <Text style={[styles.menuSubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
          {subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={theme.textTertiary} />
    </Pressable>
  );
}

interface SectionHeaderProps {
  title: string;
  badge?: string;
  action?: { label: string; onPress: () => void };
}

function SectionHeader({ title, badge, action }: SectionHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
        {title}
      </Text>
      {badge && (
        <View style={[styles.badge, { backgroundColor: Colors.primary + "20" }]}>
          <Text style={[styles.badgeText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
            {badge}
          </Text>
        </View>
      )}
      {action && (
        <Pressable onPress={action.onPress} style={styles.sectionAction}>
          <Text style={[styles.sectionActionText, { color: Colors.primary, fontFamily: "Inter_500Medium" }]}>
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function RecentCard({ item }: { item: { id: string; templateTitle: string; content: string } }) {
  const { theme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.content);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={[styles.recentCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.recentMain}>
        <View style={[styles.recentIcon, { backgroundColor: Colors.primary + "14" }]}>
          <Feather name="clock" size={15} color={Colors.primary} />
        </View>
        <Text
          style={[styles.recentTitle, { color: theme.text, fontFamily: "Inter_500Medium" }]}
          numberOfLines={1}
        >
          {item.templateTitle}
        </Text>
      </View>
      <Pressable
        onPress={handleCopy}
        style={[
          styles.recentCopyBtn,
          { backgroundColor: copied ? (theme.success + "20") : Colors.primary + "14" },
        ]}
      >
        <Feather name={copied ? "check" : "copy"} size={14} color={copied ? theme.success : Colors.primary} />
        <Text
          style={[
            styles.recentCopyText,
            { color: copied ? theme.success : Colors.primary, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          {copied ? "Kopierat" : "Kopiera"}
        </Text>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const { isDark, theme, toggleDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { addToHistory, history } = useApp();

  const [aiRemaining, setAiRemaining] = useState(10);

  useEffect(() => {
    const key = `ai_gen_${new Date().toISOString().slice(0, 10)}`;
    AsyncStorage.getItem(key).then((val) => {
      const used = val ? parseInt(val, 10) : 0;
      setAiRemaining(Math.max(0, 10 - used));
    }).catch(() => {});
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const recentItems = history.slice(0, 2);

  const handleBoverketTemplate = async (template: (typeof BOVERKET_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "boverket" },
    });
  };

  const handleSkatteverketTemplate = async (template: (typeof SKATTEVERKET_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "skatteverket" },
    });
  };

  const handleForsakringskassanTemplate = async (template: (typeof FORSAKRINGSKASSAN_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "forsakringskassan" },
    });
  };

  const handleMigrationsverketTemplate = async (template: (typeof MIGRATIONSVERKET_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "migrationsverket" },
    });
  };

  const handleKronofogdenTemplate = async (template: (typeof KRONOFOGDEN_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "kronofogden" },
    });
  };

  const handleArbetsformedlingenTemplate = async (template: (typeof ARBETSFORMEDLINGEN_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "arbetsformedlingen" },
    });
  };

  const handleSocialtjanstenTemplate = async (template: (typeof SOCIALTJANSTEN_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "socialtjansten" },
    });
  };

  const handleHyresnamndTemplate = async (template: (typeof HYRESNAMND_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "hyresnamnd" },
    });
  };

  const handleTransportstyrelsemTemplate = async (template: (typeof TRANSPORTSTYRELSEN_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "transportstyrelsen" },
    });
  };

  const handlePensionsmyndighetenTemplate = async (template: (typeof PENSIONSMYNDIGHETEN_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "pensionsmyndigheten" },
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: bottomPad + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.heroRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.heroTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
            Svar Direkt
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Skriv rätt. Få svar direkt.
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toggleDark(); }}
            style={[styles.aboutBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Feather name={isDark ? "sun" : "moon"} size={20} color={theme.tint} />
          </Pressable>
          <Pressable
            onPress={() => router.push("/about")}
            style={[styles.aboutBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Feather name="info" size={20} color={theme.tint} />
          </Pressable>
          <Pressable
            onPress={() => router.push("/profile")}
            style={[styles.aboutBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Feather name="user" size={20} color={theme.tint} />
          </Pressable>
        </View>
      </View>

      {/* AI Generator Banner */}
      <Pressable
        onPress={() => router.push("/ai-generator")}
        style={({ pressed }) => [
          styles.aiBanner,
          {
            backgroundColor: pressed ? Colors.primary + "22" : Colors.primary + "12",
            borderColor: Colors.primary + "40",
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
      >
        <View style={[styles.aiIcon, { backgroundColor: Colors.primary + "25" }]}>
          <Text style={{ fontSize: 22 }}>✨</Text>
        </View>
        <View style={styles.aiText}>
          <Text style={[styles.aiTitle, { color: theme.text }]}>AI skriver ditt brev</Text>
          <Text style={[styles.aiSub, { color: theme.textSecondary }]}>
            Beskriv situationen — AI formulerar ett komplett formellt brev på 10 sek · {aiRemaining}/10 kvar
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={Colors.primary} />
      </Pressable>

      {/* AI Feature Chips */}
      <View style={styles.aiChips}>
        {[
          { emoji: "🏛️", label: "9 myndigheter" },
          { emoji: "⚡", label: "10 sek" },
          { emoji: "🇸🇪", label: "På svenska" },
        ].map((chip) => (
          <View key={chip.label} style={[styles.aiChip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={{ fontSize: 13 }}>{chip.emoji}</Text>
            <Text style={[styles.aiChipText, { color: theme.textSecondary }]}>{chip.label}</Text>
          </View>
        ))}
      </View>

      {/* Senast använda */}
      {recentItems.length > 0 && (
        <>
          <SectionHeader
            title="SENAST ANVÄNDA"
            action={{ label: "Visa alla", onPress: () => router.push("/history") }}
          />
          <View style={[styles.recentGrid, { marginBottom: 20 }]}>
            {recentItems.map((item) => (
              <RecentCard key={item.id} item={item} />
            ))}
          </View>
        </>
      )}

      {/* Boverket templates */}
      <SectionHeader title="BOVERKETS MALLAR" badge={`${BOVERKET_TEMPLATES.length} mallar`} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boverketRow}
      >
        {BOVERKET_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handleBoverketTemplate(template)}
            style={({ pressed }) => [
              styles.boverketCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: Colors.primary + "15" }]}>
              <Feather name="file-text" size={22} color={Colors.primary} />
            </View>
            <Text
              style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
              numberOfLines={2}
            >
              {template.title}
            </Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {template.category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Skatteverket templates */}
      <SectionHeader title="SKATTEVERKETS MALLAR" badge="14 mallar" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boverketRow}
      >
        {SKATTEVERKET_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handleSkatteverketTemplate(template)}
            style={({ pressed }) => [
              styles.boverketCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: "#00b894" + "15" }]}>
              <Feather name="briefcase" size={22} color="#00b894" />
            </View>
            <Text
              style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
              numberOfLines={2}
            >
              {template.title}
            </Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {template.category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Försäkringskassan templates */}
      <SectionHeader title="FÖRSÄKRINGSKASSANS MALLAR" badge={`${FORSAKRINGSKASSAN_TEMPLATES.length} mallar`} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boverketRow}
      >
        {FORSAKRINGSKASSAN_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handleForsakringskassanTemplate(template)}
            style={({ pressed }) => [
              styles.boverketCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: "#0984e3" + "15" }]}>
              <Feather name="heart" size={22} color="#0984e3" />
            </View>
            <Text
              style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
              numberOfLines={2}
            >
              {template.title}
            </Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {template.category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Migrationsverket templates */}
      <SectionHeader title="MIGRATIONSVERKETS MALLAR" badge={`${MIGRATIONSVERKET_TEMPLATES.length} mallar`} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boverketRow}
      >
        {MIGRATIONSVERKET_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handleMigrationsverketTemplate(template)}
            style={({ pressed }) => [
              styles.boverketCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: "#6c5ce7" + "15" }]}>
              <Feather name="globe" size={22} color="#6c5ce7" />
            </View>
            <Text
              style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
              numberOfLines={2}
            >
              {template.title}
            </Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {template.category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Kronofogden templates */}
      <SectionHeader title="KRONOFOGDENS MALLAR" badge={`${KRONOFOGDEN_TEMPLATES.length} mallar`} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boverketRow}
      >
        {KRONOFOGDEN_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handleKronofogdenTemplate(template)}
            style={({ pressed }) => [
              styles.boverketCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: "#e17055" + "15" }]}>
              <Feather name="alert-circle" size={22} color="#e17055" />
            </View>
            <Text
              style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
              numberOfLines={2}
            >
              {template.title}
            </Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {template.category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Arbetsförmedlingen templates */}
      <SectionHeader title="ARBETSFÖRMEDLINGENS MALLAR" badge={`${ARBETSFORMEDLINGEN_TEMPLATES.length} mallar`} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boverketRow}
      >
        {ARBETSFORMEDLINGEN_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handleArbetsformedlingenTemplate(template)}
            style={({ pressed }) => [
              styles.boverketCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: "#00b894" + "15" }]}>
              <Feather name="briefcase" size={22} color="#00b894" />
            </View>
            <Text
              style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
              numberOfLines={2}
            >
              {template.title}
            </Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              {template.category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Socialtjänsten templates */}
      <SectionHeader title="SOCIALTJÄNSTENS MALLAR" badge={`${SOCIALTJANSTEN_TEMPLATES.length} mallar`} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boverketRow}>
        {SOCIALTJANSTEN_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handleSocialtjanstenTemplate(template)}
            style={({ pressed }) => [styles.boverketCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: "#fd79a815" }]}>
              <Feather name="heart" size={22} color="#fd79a8" />
            </View>
            <Text style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>{template.title}</Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>{template.category}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Hyresnämnden templates */}
      <SectionHeader title="HYRESNÄMNDENS MALLAR" badge={`${HYRESNAMND_TEMPLATES.length} mallar`} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boverketRow}>
        {HYRESNAMND_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handleHyresnamndTemplate(template)}
            style={({ pressed }) => [styles.boverketCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: "#fdcb6e15" }]}>
              <Feather name="home" size={22} color="#fdcb6e" />
            </View>
            <Text style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>{template.title}</Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>{template.category}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Transportstyrelsen templates */}
      <SectionHeader title="TRANSPORTSTYRELSENS MALLAR" badge={`${TRANSPORTSTYRELSEN_TEMPLATES.length} mallar`} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boverketRow}>
        {TRANSPORTSTYRELSEN_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handleTransportstyrelsemTemplate(template)}
            style={({ pressed }) => [styles.boverketCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: "#74b9ff15" }]}>
              <Feather name="truck" size={22} color="#74b9ff" />
            </View>
            <Text style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>{template.title}</Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>{template.category}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Pensionsmyndigheten templates */}
      <SectionHeader title="PENSIONSMYNDIGHETENS MALLAR" badge={`${PENSIONSMYNDIGHETEN_TEMPLATES.length} mallar`} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boverketRow}>
        {PENSIONSMYNDIGHETEN_TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            onPress={() => handlePensionsmyndighetenTemplate(template)}
            style={({ pressed }) => [styles.boverketCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
          >
            <View style={[styles.boverketIconWrap, { backgroundColor: "#a29bfe15" }]}>
              <Feather name="umbrella" size={22} color="#a29bfe" />
            </View>
            <Text style={[styles.boverketTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={2}>{template.title}</Text>
            <Text style={[styles.boverketCategory, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>{template.category}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Verktyg */}
      <SectionHeader title="VERKTYG" />
      <View style={styles.menuGrid}>
        <MenuItem
          icon={<Feather name="zap" size={22} color="#e17055" />}
          title="Snabb lösning ⚡"
          subtitle="Direkta svar på några sekunder"
          onPress={() => router.push("/quick-solution")}
          accent="#e17055"
        />
        <MenuItem
          icon={<Ionicons name="document-text-outline" size={22} color="#6c5ce7" />}
          title="Anteckningsblock"
          subtitle="Dina personliga noteringar"
          onPress={() => router.push("/(tabs)/notepad")}
          accent="#6c5ce7"
        />
        <MenuItem
          icon={<Feather name="clock" size={22} color="#0a7ea4" />}
          title="Historik"
          subtitle="Senast använda mallar"
          onPress={() => router.push("/history")}
          accent="#0a7ea4"
        />
        <MenuItem
          icon={<MaterialCommunityIcons name="book-open-variant" size={22} color="#00b894" />}
          title="Vägledning och ordlista"
          subtitle="Juridiska termer och guide"
          onPress={() => router.push("/about")}
          accent="#00b894"
        />
        <MenuItem
          icon={<Feather name="message-circle" size={22} color="#fdcb6e" />}
          title="Snabba svar"
          subtitle="Kortare färdiga svar"
          onPress={() => router.push("/quick-responses")}
          accent="#fdcb6e"
        />
      </View>

      {/* FÖRSVARA DIG */}
      <View style={[styles.forsvarBanner, { backgroundColor: "#d63031" + "10", borderColor: "#d63031" + "30" }]}>
        <View style={styles.forsvarBannerTop}>
          <View style={[styles.forsvarIcon, { backgroundColor: "#d63031" + "20" }]}>
            <Feather name="shield" size={22} color="#d63031" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.forsvarTitle, { color: theme.text, fontFamily: "Inter_700Bold" }]}>
              FÖRSVARA DIG ⚖️
            </Text>
            <Text style={[styles.forsvarDesc, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Skydda dina rättigheter och agera mot felaktiga krav
            </Text>
          </View>
        </View>
        <View style={styles.forsvarGrid}>
          {[
            { id: "felaktigt", label: "Felaktigt krav", icon: "x-circle" },
            { id: "avgift", label: "För hög avgift", icon: "dollar-sign" },
            { id: "ingenvar", label: "Inget svar", icon: "mail" },
            { id: "overklagan", label: "Överklagan", icon: "chevrons-up" },
            { id: "bevis", label: "Begäran om bevis", icon: "file-minus" },
          ].map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push({ pathname: "/forsvar", params: { situation: item.id } })}
              style={({ pressed }) => [
                styles.forsvarBtn,
                {
                  backgroundColor: pressed ? "#d63031" + "15" : theme.card,
                  borderColor: "#d63031" + "35",
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Feather name={item.icon as any} size={16} color="#d63031" />
              <Text style={[styles.forsvarBtnText, { color: theme.text, fontFamily: "Inter_500Medium" }]} numberOfLines={2}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Pro-funktioner */}
      <SectionHeader title="PRO-FUNKTIONER" />
      <View style={styles.menuGrid}>
        <MenuItem
          icon={<Feather name="bell" size={22} color="#e17055" />}
          title="Påminnelser"
          subtitle="Ange viktiga datum"
          onPress={() => router.push("/reminders")}
          accent="#e17055"
        />
        <MenuItem
          icon={<Feather name="edit-3" size={22} color="#0a7ea4" />}
          title="Mina mallar"
          subtitle="Skapa egna mallar"
          onPress={() => router.push("/custom-templates")}
          accent="#0a7ea4"
        />
        <MenuItem
          icon={<Feather name="search" size={22} color="#a29bfe" />}
          title="Sök mallar"
          subtitle="Hitta rätt mall snabbt"
          onPress={() => router.push("/(tabs)/search")}
          accent="#a29bfe"
        />
        <MenuItem
          icon={<Feather name="heart" size={22} color="#fd79a8" />}
          title="Favoriter"
          subtitle="Dina sparade mallar"
          onPress={() => router.push("/(tabs)/favorites")}
          accent="#fd79a8"
        />
        <MenuItem
          icon={<Feather name="book-open" size={22} color="#e17055" />}
          title="PDF Guider"
          subtitle="Spara och öppna PDF-guider offline"
          onPress={() => router.push("/guides")}
          accent="#e17055"
        />
        <MenuItem
          icon={<Feather name="package" size={22} color="#00b894" />}
          title="Lägg till modul"
          subtitle="Importera data-paket (JSON)"
          onPress={() => router.push("/import-module")}
          accent="#00b894"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },

  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 14,
    marginTop: 3,
  },
  aboutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: { fontSize: 11 },
  sectionAction: {
    marginLeft: "auto",
  },
  sectionActionText: { fontSize: 13 },

  recentGrid: { gap: 8 },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  recentMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  recentIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  recentTitle: {
    fontSize: 14,
    flex: 1,
  },
  recentCopyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  recentCopyText: { fontSize: 13 },

  boverketRow: {
    paddingBottom: 4,
    paddingRight: 4,
    gap: 12,
    marginBottom: 20,
  },
  boverketCard: {
    width: 148,
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  boverketIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  boverketTitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  boverketCategory: { fontSize: 11 },

  menuGrid: { gap: 8, marginBottom: 20 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 15 },
  menuSubtitle: { fontSize: 12, marginTop: 2 },

  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  aiIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  aiText: { flex: 1 },
  aiTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  aiSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    lineHeight: 17,
  },
  aiChips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  aiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  aiChipText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },

  forsvarBanner: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 14,
    marginBottom: 20,
    marginTop: 8,
  },
  forsvarBannerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  forsvarIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  forsvarTitle: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
  forsvarDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  forsvarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  forsvarBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  forsvarBtnText: {
    fontSize: 13,
    flexShrink: 1,
  },
});
