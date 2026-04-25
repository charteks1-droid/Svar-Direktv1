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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ARBETSFORMEDLINGEN_TEMPLATES,
  BOVERKET_TEMPLATES,
  CATEGORIES,
  CV_CATEGORIES,
  CV_TEMPLATES,
  Category,
  CvCategory,
  FORSAKRINGSKASSAN_TEMPLATES,
  HYRESNAMND_TEMPLATES,
  KRONOFOGDEN_TEMPLATES,
  MIGRATIONSVERKET_TEMPLATES,
  PENSIONSMYNDIGHETEN_TEMPLATES,
  SKATTEVERKET_TEMPLATES,
  SOCIALTJANSTEN_TEMPLATES,
  TRANSPORTSTYRELSEN_TEMPLATES,
  Template,
} from "@/data/situations";

const ALL_MYNDIGHET_TEMPLATES: Template[] = [
  ...BOVERKET_TEMPLATES,
  ...SKATTEVERKET_TEMPLATES,
  ...FORSAKRINGSKASSAN_TEMPLATES,
  ...MIGRATIONSVERKET_TEMPLATES,
  ...KRONOFOGDEN_TEMPLATES,
  ...ARBETSFORMEDLINGEN_TEMPLATES,
  ...SOCIALTJANSTEN_TEMPLATES,
  ...HYRESNAMND_TEMPLATES,
  ...TRANSPORTSTYRELSEN_TEMPLATES,
  ...PENSIONSMYNDIGHETEN_TEMPLATES,
];

type Mode = "myndighet" | "cv";

function ModeToggle({
  mode,
  onSelect,
}: {
  mode: Mode;
  onSelect: (m: Mode) => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        modeStyles.wrap,
        { backgroundColor: theme.backgroundTertiary },
      ]}
    >
      {(["myndighet", "cv"] as Mode[]).map((m) => (
        <Pressable
          key={m}
          onPress={() => onSelect(m)}
          style={[
            modeStyles.btn,
            mode === m && { backgroundColor: Colors.primary },
          ]}
        >
          <Text
            style={[
              modeStyles.label,
              {
                color: mode === m ? "#fff" : theme.textSecondary,
                fontFamily:
                  mode === m ? "Inter_600SemiBold" : "Inter_400Regular",
              },
            ]}
          >
            {m === "myndighet" ? "Myndighetsbrev" : "CV-mallar"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function CategoryPill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: selected ? Colors.primary : theme.card,
          borderColor: selected ? Colors.primary : theme.cardBorder,
        },
      ]}
    >
      <Text
        style={[
          styles.pillText,
          {
            color: selected ? "#fff" : theme.textSecondary,
            fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function TemplateCard({
  template,
  source,
}: {
  template: Template;
  source: string;
}) {
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(template.id);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/template-detail",
      params: { id: template.id, source },
    });
  };

  const handleFav = async (e: any) => {
    e.stopPropagation?.();
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
      <View style={styles.cardTop}>
        <View
          style={[styles.catBadge, { backgroundColor: Colors.primary + "18" }]}
        >
          <Text
            style={[
              styles.catText,
              { color: Colors.primary, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {template.category}
          </Text>
        </View>
        <Pressable onPress={handleFav} hitSlop={8}>
          <Feather
            name="heart"
            size={20}
            color={fav ? "#fd79a8" : theme.textTertiary}
            style={{ opacity: fav ? 1 : 0.5 }}
          />
        </Pressable>
      </View>
      <Text
        style={[
          styles.cardTitle,
          { color: theme.text, fontFamily: "Inter_600SemiBold" },
        ]}
      >
        {template.title}
      </Text>
      <Text
        style={[
          styles.cardDesc,
          { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
        ]}
        numberOfLines={2}
      >
        {template.description}
      </Text>
      <View style={styles.cardTags}>
        {template.tags.slice(0, 3).map((tag) => (
          <View
            key={tag}
            style={[styles.tag, { backgroundColor: theme.backgroundTertiary }]}
          >
            <Text
              style={[
                styles.tagText,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              #{tag}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

export default function TemplatesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode>("myndighet");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Alla");
  const [selectedCvCategory, setSelectedCvCategory] =
    useState<CvCategory>("Alla");
  const [search, setSearch] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleModeSelect = (m: Mode) => {
    setMode(m);
    setSearch("");
    setSelectedCategory("Alla");
    setSelectedCvCategory("Alla");
  };

  const filtered =
    mode === "myndighet"
      ? ALL_MYNDIGHET_TEMPLATES.filter((t) => {
          const matchCat =
            selectedCategory === "Alla" || t.category === selectedCategory;
          const q = search.toLowerCase();
          const matchSearch =
            !q ||
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.includes(q));
          return matchCat && matchSearch;
        })
      : CV_TEMPLATES.filter((t) => {
          const matchCat =
            selectedCvCategory === "Alla" ||
            t.category === selectedCvCategory;
          const q = search.toLowerCase();
          const matchSearch =
            !q ||
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.includes(q));
          return matchCat && matchSearch;
        });

  const categories = mode === "myndighet" ? [...CATEGORIES] : [...CV_CATEGORIES];

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
          Mallar
        </Text>

        <ModeToggle mode={mode} onSelect={handleModeSelect} />

        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: theme.background,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Feather name="search" size={16} color={theme.textTertiary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={
              mode === "myndighet" ? "Sök myndighetsmall..." : "Sök CV-mall..."
            }
            placeholderTextColor={theme.textTertiary}
            style={[
              styles.searchInput,
              { color: theme.text, fontFamily: "Inter_400Regular" },
            ]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={theme.textTertiary} />
            </Pressable>
          )}
        </View>

        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.pillRow}
          renderItem={({ item }) =>
            mode === "myndighet" ? (
              <CategoryPill
                label={item}
                selected={selectedCategory === item}
                onPress={() => setSelectedCategory(item as Category)}
              />
            ) : (
              <CategoryPill
                label={item}
                selected={selectedCvCategory === item}
                onPress={() => setSelectedCvCategory(item as CvCategory)}
              />
            )
          }
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TemplateCard
            template={item}
            source={
              mode === "cv"
                ? "cv"
                : item.id.startsWith("kron-")
                ? "kronofogden"
                : item.id.startsWith("af-")
                ? "arbetsformedlingen"
                : item.id.startsWith("skatt-")
                ? "skatteverket"
                : item.id.startsWith("fk-")
                ? "forsakringskassan"
                : item.id.startsWith("mig-")
                ? "migrationsverket"
                : item.id.startsWith("soc-")
                ? "socialtjansten"
                : item.id.startsWith("hn-")
                ? "hyresnamnd"
                : item.id.startsWith("ts-")
                ? "transportstyrelsen"
                : item.id.startsWith("pm-")
                ? "pensionsmyndigheten"
                : "boverket"
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="file-text" size={40} color={theme.textTertiary} />
            <Text
              style={[
                styles.emptyText,
                { color: theme.textSecondary, fontFamily: "Inter_500Medium" },
              ]}
            >
              Inga mallar hittades
            </Text>
          </View>
        }
      />
    </View>
  );
}

const modeStyles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  label: {
    fontSize: 13,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 0,
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
    gap: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  pillRow: {
    gap: 8,
    paddingBottom: 14,
    paddingRight: 16,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pillText: {
    fontSize: 13,
  },
  list: { padding: 16, gap: 10 },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  catText: { fontSize: 11 },
  cardTitle: { fontSize: 16 },
  cardDesc: { fontSize: 13, lineHeight: 19 },
  cardTags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 11 },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: { fontSize: 16 },
});
