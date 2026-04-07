import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Alert,
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
import { HistoryItem, useApp } from "@/contexts/AppContext";

function formatDateTime(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleString("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistoryCard({ item, onDelete }: { item: HistoryItem; onDelete: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.content);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardHeader}>
          <Feather name="clock" size={14} color={Colors.primary} />
          <Text
            style={[
              styles.cardDate,
              { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
          >
            {formatDateTime(item.usedAt)}
          </Text>
        </View>
        <Pressable onPress={onDelete} hitSlop={8}>
          <Feather name="trash-2" size={16} color={theme.danger} />
        </Pressable>
      </View>
      <Text
        style={[
          styles.cardTitle,
          { color: theme.text, fontFamily: "Inter_600SemiBold" },
        ]}
        numberOfLines={1}
      >
        {item.templateTitle}
      </Text>
      <Text
        style={[
          styles.cardPreview,
          { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
        ]}
        numberOfLines={2}
      >
        {item.content}
      </Text>
      <Pressable
        onPress={handleCopy}
        style={[
          styles.copyBtn,
          {
            backgroundColor: copied ? theme.success + "20" : Colors.primary + "12",
          },
        ]}
      >
        <Feather
          name={copied ? "check" : "copy"}
          size={14}
          color={copied ? theme.success : Colors.primary}
        />
        <Text
          style={[
            styles.copyBtnText,
            {
              color: copied ? theme.success : Colors.primary,
              fontFamily: "Inter_600SemiBold",
            },
          ]}
        >
          {copied ? "Kopierat" : "Kopiera"}
        </Text>
      </Pressable>
    </View>
  );
}

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { history, deleteHistoryItem, clearHistory } = useApp();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleClear = () => {
    Alert.alert("Rensa historik", "Vill du ta bort hela historiken?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Rensa",
        style: "destructive",
        onPress: () => clearHistory(),
      },
    ]);
  };

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.background }]}
      data={history}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.list,
        { paddingBottom: bottomPad + 20 },
      ]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        history.length > 0 ? (
          <Pressable onPress={handleClear} style={styles.clearBtn}>
            <Feather name="trash-2" size={16} color={theme.danger} />
            <Text
              style={[
                styles.clearText,
                { color: theme.danger, fontFamily: "Inter_500Medium" },
              ]}
            >
              Rensa historik
            </Text>
          </Pressable>
        ) : null
      }
      renderItem={({ item }) => (
        <HistoryCard
          item={item}
          onDelete={() => deleteHistoryItem(item.id)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Feather name="clock" size={44} color={theme.textTertiary} />
          <Text
            style={[
              styles.emptyTitle,
              { color: theme.text, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            Ingen historik
          </Text>
          <Text
            style={[
              styles.emptySub,
              { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
          >
            Mallar du kopierar visas här
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 10 },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    marginBottom: 8,
    padding: 4,
  },
  clearText: { fontSize: 14 },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardDate: { fontSize: 12 },
  cardTitle: { fontSize: 15 },
  cardPreview: { fontSize: 13, lineHeight: 18 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  copyBtnText: { fontSize: 13 },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, marginTop: 4 },
  emptySub: { fontSize: 14 },
});
