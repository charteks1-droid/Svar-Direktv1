import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { BOVERKET_TEMPLATES, Template } from "@/data/situations";

function FavCard({ template }: { template: Template }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const { toggleFavorite } = useApp();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source: "boverket" },
    });
  };

  const handleUnfav = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(template.id);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      <View style={styles.cardLeft}>
        <View
          style={[styles.iconWrap, { backgroundColor: Colors.primary + "18" }]}
        >
          <Feather name="file-text" size={20} color={Colors.primary} />
        </View>
        <View style={styles.cardText}>
          <Text
            style={[
              styles.cardTitle,
              { color: theme.text, fontFamily: "Inter_600SemiBold" },
            ]}
            numberOfLines={1}
          >
            {template.title}
          </Text>
          <Text
            style={[
              styles.cardCat,
              { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
          >
            {template.category}
          </Text>
        </View>
      </View>
      <Pressable onPress={handleUnfav} hitSlop={8}>
        <Feather name="heart" size={20} color="#fd79a8" />
      </Pressable>
    </Pressable>
  );
}

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { favorites, customTemplates, isFavorite } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const favTemplates = BOVERKET_TEMPLATES.filter((t) => isFavorite(t.id));
  const favCustom = customTemplates.filter((t) => isFavorite(t.id));

  const allFavs: Template[] = [
    ...favTemplates,
    ...favCustom.map((ct) => ({
      id: ct.id,
      title: ct.title,
      category: ct.category,
      description: "",
      content: ct.content,
      tags: [],
    })),
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: theme.backgroundSecondary,
            borderBottomColor: theme.separator,
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: theme.text, fontFamily: "Inter_700Bold" },
          ]}
        >
          Favoriter
        </Text>
        <Text
          style={[
            styles.headerCount,
            { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
          ]}
        >
          {allFavs.length} sparade
        </Text>
      </View>

      <FlatList
        data={allFavs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <FavCard template={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="heart" size={44} color={theme.textTertiary} />
            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              Inga favoriter ännu
            </Text>
            <Text
              style={[
                styles.emptySub,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              Tryck på hjärtat på en mall för att spara den som favorit
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  headerCount: { fontSize: 13, marginTop: 2 },
  list: { padding: 16, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15 },
  cardCat: { fontSize: 12, marginTop: 2 },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 18, marginTop: 4 },
  emptySub: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
