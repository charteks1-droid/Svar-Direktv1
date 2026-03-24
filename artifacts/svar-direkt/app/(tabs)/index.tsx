import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
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
import { useApp } from "@/contexts/AppContext";
import { BOVERKET_TEMPLATES } from "@/data/situations";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  accent?: string;
}

function MenuItem({ icon, title, subtitle, onPress, accent }: MenuItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

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
      <View
        style={[
          styles.menuIcon,
          { backgroundColor: (accent || Colors.primary) + "18" },
        ]}
      >
        {icon}
      </View>
      <View style={styles.menuText}>
        <Text
          style={[styles.menuTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.menuSubtitle,
            { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
          ]}
        >
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
}

function SectionHeader({ title, badge }: SectionHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={styles.sectionHeader}>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" },
        ]}
      >
        {title}
      </Text>
      {badge && (
        <View style={[styles.badge, { backgroundColor: Colors.primary + "20" }]}>
          <Text
            style={[
              styles.badgeText,
              { color: Colors.primary, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {badge}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { addToHistory } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleBoverketTemplate = async (template: (typeof BOVERKET_TEMPLATES)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToHistory({ templateTitle: template.title, content: template.content });
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "boverket" },
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
      <View style={styles.heroRow}>
        <View>
          <Text
            style={[
              styles.heroTitle,
              { color: theme.text, fontFamily: "Inter_700Bold" },
            ]}
          >
            Svar Direkt
          </Text>
          <Text
            style={[
              styles.heroSubtitle,
              { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
          >
            Professionella svar på rätt sätt
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/about")}
          style={[styles.aboutBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <Feather name="info" size={20} color={theme.tint} />
        </Pressable>
      </View>

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
            <View
              style={[
                styles.boverketIconWrap,
                { backgroundColor: Colors.primary + "15" },
              ]}
            >
              <Feather name="file-text" size={22} color={Colors.primary} />
            </View>
            <Text
              style={[
                styles.boverketTitle,
                { color: theme.text, fontFamily: "Inter_600SemiBold" },
              ]}
              numberOfLines={2}
            >
              {template.title}
            </Text>
            <Text
              style={[
                styles.boverketCategory,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              {template.category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

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
    marginTop: 2,
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
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
  },
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
  boverketCategory: {
    fontSize: 11,
  },
  menuGrid: {
    gap: 8,
    marginBottom: 20,
  },
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
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
