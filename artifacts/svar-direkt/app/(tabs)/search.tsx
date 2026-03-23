import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { BOVERKET_TEMPLATES, Template } from "@/data/situations";

type SearchResult = Template & { source: "boverket" | "custom" };

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const { customTemplates, toggleFavorite, isFavorite } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const customAsTemplates: Template[] = customTemplates.map((ct) => ({
    id: ct.id,
    title: ct.title,
    category: ct.category,
    description: "",
    content: ct.content,
    tags: [],
  }));

  const allTemplates: SearchResult[] = [
    ...BOVERKET_TEMPLATES.map((t) => ({ ...t, source: "boverket" as const })),
    ...customAsTemplates.map((t) => ({ ...t, source: "custom" as const })),
  ];

  const results =
    query.trim().length === 0
      ? []
      : allTemplates.filter((t) => {
          const q = query.toLowerCase();
          return (
            t.title.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.content.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.includes(q))
          );
        });

  const handlePress = async (item: SearchResult) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/template-detail",
      params: { id: item.id, source: item.source },
    });
  };

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
          Sök
        </Text>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: theme.background, borderColor: theme.cardBorder },
          ]}
        >
          <Feather name="search" size={18} color={theme.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Sök bland alla mallar..."
            placeholderTextColor={theme.textTertiary}
            style={[
              styles.searchInput,
              { color: theme.text, fontFamily: "Inter_400Regular" },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Feather name="x-circle" size={18} color={theme.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      {query.trim().length > 0 && (
        <Text
          style={[
            styles.resultsLabel,
            { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
          ]}
        >
          {results.length} resultat för "{query}"
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const fav = isFavorite(item.id);
          return (
            <Pressable
              onPress={() => handlePress(item)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={styles.cardRow}>
                <View style={styles.cardMain}>
                  <View style={styles.cardTop}>
                    <View
                      style={[
                        styles.sourceBadge,
                        {
                          backgroundColor:
                            item.source === "custom"
                              ? "#6c5ce7" + "20"
                              : Colors.primary + "18",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sourceBadgeText,
                          {
                            color:
                              item.source === "custom" ? "#6c5ce7" : Colors.primary,
                            fontFamily: "Inter_600SemiBold",
                          },
                        ]}
                      >
                        {item.source === "custom" ? "Min mall" : item.category}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: theme.text, fontFamily: "Inter_600SemiBold" },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  {item.description ? (
                    <Text
                      style={[
                        styles.cardDesc,
                        { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
                      ]}
                      numberOfLines={1}
                    >
                      {item.description}
                    </Text>
                  ) : null}
                </View>
                <Pressable
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    toggleFavorite(item.id);
                  }}
                  hitSlop={8}
                >
                  <Feather
                    name="heart"
                    size={20}
                    color={fav ? "#fd79a8" : theme.textTertiary}
                    style={{ opacity: fav ? 1 : 0.5 }}
                  />
                </Pressable>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          query.trim().length === 0 ? (
            <View style={styles.empty}>
              <Feather name="search" size={44} color={theme.textTertiary} />
              <Text
                style={[
                  styles.emptyTitle,
                  { color: theme.text, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                Sök efter mallar
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
                ]}
              >
                Hitta Boverkets mallar och dina egna skapade mallar
              </Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Feather name="frown" size={40} color={theme.textTertiary} />
              <Text
                style={[
                  styles.emptyTitle,
                  { color: theme.text, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                Inga resultat
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 28,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 16 },
  resultsLabel: {
    fontSize: 13,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  list: { padding: 16, gap: 10 },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardMain: { flex: 1, gap: 6 },
  cardTop: { flexDirection: "row" },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sourceBadgeText: { fontSize: 11 },
  cardTitle: { fontSize: 15 },
  cardDesc: { fontSize: 12 },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 18, marginTop: 4 },
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
