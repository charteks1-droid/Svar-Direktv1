import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
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

export default function TemplateDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { id, source } = useLocalSearchParams<{ id: string; source: string }>();
  const { customTemplates, toggleFavorite, isFavorite, addToHistory } = useApp();
  const [copied, setCopied] = useState(false);

  const template =
    source === "custom"
      ? customTemplates.find((t) => t.id === id)
        ? {
            ...customTemplates.find((t) => t.id === id)!,
            description: "",
            tags: [] as string[],
          }
        : null
      : BOVERKET_TEMPLATES.find((t) => t.id === id) ?? null;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleCopy = async () => {
    if (!template) return;
    await Clipboard.setStringAsync(template.content);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    addToHistory({ templateTitle: template.title, content: template.content });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = async () => {
    if (!template) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const subject = encodeURIComponent("Ärende – begäran");
    const body = encodeURIComponent(template.content);
    const url = `mailto:?subject=${subject}&body=${body}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  const handleFav = async () => {
    if (!template) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(template.id);
  };

  if (!template) {
    return (
      <View
        style={[styles.notFound, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.notFoundText, { color: theme.text }]}>
          Mall hittades inte
        </Text>
      </View>
    );
  }

  const fav = isFavorite(template.id);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.meta}>
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
          {"description" in template && template.description ? (
            <Text
              style={[
                styles.desc,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              {template.description}
            </Text>
          ) : null}
          {"tags" in template && template.tags.length > 0 ? (
            <View style={styles.tags}>
              {template.tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tag,
                    { backgroundColor: theme.backgroundTertiary },
                  ]}
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
          ) : null}
        </View>

        <View
          style={[
            styles.contentBox,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          <Text
            style={[
              styles.templateText,
              { color: theme.text, fontFamily: "Inter_400Regular" },
            ]}
            selectable
          >
            {template.content}
          </Text>
        </View>

        <View
          style={[styles.hintBox, { backgroundColor: theme.backgroundTertiary }]}
        >
          <Feather name="info" size={14} color={Colors.primary} />
          <Text
            style={[
              styles.hintText,
              { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
          >
            Ersätt texten i [HAKPARENTESER] med dina uppgifter innan du skickar.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.actions,
          {
            paddingBottom: bottomPad + 12,
            backgroundColor: theme.backgroundSecondary,
            borderTopColor: theme.separator,
          },
        ]}
      >
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleFav}
            style={[
              styles.favBtn,
              {
                backgroundColor: fav ? "#fd79a8" + "20" : theme.card,
                borderColor: fav ? "#fd79a8" : theme.cardBorder,
              },
            ]}
          >
            <Feather name="heart" size={20} color={fav ? "#fd79a8" : theme.textSecondary} />
          </Pressable>
          <Pressable
            onPress={handleCopy}
            style={[
              styles.copyBtn,
              { backgroundColor: copied ? theme.success : Colors.primary },
            ]}
          >
            <Feather name={copied ? "check" : "copy"} size={20} color="#fff" />
            <Text style={[styles.copyBtnText, { fontFamily: "Inter_700Bold" }]}>
              {copied ? "Kopierat!" : "Kopiera mall"}
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={handleEmail}
          style={[styles.emailBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <Feather name="mail" size={18} color={theme.textSecondary} />
          <Text style={[styles.emailBtnText, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
            Skicka via e-post
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  meta: { gap: 10 },
  catBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catText: { fontSize: 12 },
  desc: { fontSize: 14, lineHeight: 20 },
  tags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 11 },
  contentBox: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
  },
  templateText: {
    fontSize: 15,
    lineHeight: 24,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  hintText: { flex: 1, fontSize: 13, lineHeight: 18 },
  actions: {
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  favBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    flexShrink: 0,
  },
  copyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    borderRadius: 16,
  },
  copyBtnText: {
    color: "#fff",
    fontSize: 17,
  },
  emailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  emailBtnText: { fontSize: 15 },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: { fontSize: 16 },
});
