import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
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
import { AiConversation, useApp } from "@/contexts/AppContext";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("sv-SE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function ConversationModal({ item, visible, onClose }: { item: AiConversation; visible: boolean; onClose: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.reply);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]} numberOfLines={1}>
            {item.institution}
          </Text>
          <Pressable onPress={onClose} hitSlop={10}>
            <Feather name="x" size={22} color={theme.textSecondary} />
          </Pressable>
        </View>
        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
          <View style={[styles.bubble, { backgroundColor: Colors.primary + "12" }]}>
            <Text style={[styles.bubbleLabel, { color: Colors.primary }]}>Twoje pytanie</Text>
            <Text style={[styles.bubbleText, { color: theme.text }]}>{item.question}</Text>
          </View>
          <View style={[styles.bubble, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: StyleSheet.hairlineWidth }]}>
            <Text style={[styles.bubbleLabel, { color: theme.textSecondary }]}>Odpowiedź AI</Text>
            <Text style={[styles.bubbleText, { color: theme.text }]}>{item.reply}</Text>
          </View>
          <Pressable
            onPress={handleCopy}
            style={[styles.copyBtn, { backgroundColor: copied ? theme.success + "20" : Colors.primary + "12" }]}
          >
            <Feather name={copied ? "check" : "copy"} size={15} color={copied ? theme.success : Colors.primary} />
            <Text style={[styles.copyBtnText, { color: copied ? theme.success : Colors.primary }]}>
              {copied ? "Kopierat" : "Kopiera svar"}
            </Text>
          </Pressable>
          <Text style={[styles.dateSmall, { color: theme.textTertiary }]}>{formatDateTime(item.createdAt)}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

function AiHistoryCard({ item, onDelete, onPress }: { item: AiConversation; onDelete: () => void; onPress: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.cardTop}>
        <View style={styles.cardHeader}>
          <Feather name="cpu" size={13} color={Colors.primary} />
          <Text style={[styles.cardDate, { color: theme.textSecondary }]}>{formatDateTime(item.createdAt)}</Text>
          <View style={[styles.badge, { backgroundColor: Colors.primary + "15" }]}>
            <Text style={[styles.badgeText, { color: Colors.primary }]}>{item.institution}</Text>
          </View>
        </View>
        <Pressable onPress={onDelete} hitSlop={8}>
          <Feather name="trash-2" size={15} color={theme.danger} />
        </Pressable>
      </View>
      <Text style={[styles.cardQuestion, { color: theme.text }]} numberOfLines={2}>{item.question}</Text>
      <Text style={[styles.cardPreview, { color: theme.textSecondary }]} numberOfLines={2}>{item.reply}</Text>
      <View style={styles.tapHint}>
        <Feather name="eye" size={12} color={theme.textTertiary} />
        <Text style={[styles.tapHintText, { color: theme.textTertiary }]}>Tryck för att läsa hela</Text>
      </View>
    </Pressable>
  );
}

export default function AiHistoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { aiConversations, deleteAiConversation, clearAiConversations } = useApp();
  const [selected, setSelected] = useState<AiConversation | null>(null);

  const handleClear = () => {
    Alert.alert("Rensa historik", "Vill du ta bort alla AI-konversationer?", [
      { text: "Avbryt", style: "cancel" },
      { text: "Rensa", style: "destructive", onPress: () => clearAiConversations() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={aiConversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          aiConversations.length > 0 ? (
            <Pressable onPress={handleClear} style={styles.clearBtn}>
              <Feather name="trash-2" size={15} color={theme.danger} />
              <Text style={[styles.clearText, { color: theme.danger }]}>Rensa alla</Text>
            </Pressable>
          ) : null
        }
        renderItem={({ item }) => (
          <AiHistoryCard
            item={item}
            onDelete={() => deleteAiConversation(item.id)}
            onPress={() => setSelected(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="cpu" size={44} color={theme.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Ingen AI-historik</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              Dina AI-brev visas här när du har genererat dem
            </Text>
          </View>
        }
      />
      {selected && (
        <ConversationModal item={selected} visible={true} onClose={() => setSelected(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 10 },
  clearBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-end", marginBottom: 8, padding: 4 },
  clearText: { fontSize: 14 },
  card: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 8 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  cardDate: { fontSize: 11 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  cardQuestion: { fontSize: 14, fontWeight: "600" },
  cardPreview: { fontSize: 13, lineHeight: 18 },
  tapHint: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  tapHintText: { fontSize: 11 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "600", marginTop: 4 },
  emptySub: { fontSize: 14, textAlign: "center" },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  modalTitle: { fontSize: 16, fontWeight: "700", flex: 1, marginRight: 12 },
  modalBody: { flex: 1, padding: 16 },
  bubble: { borderRadius: 12, padding: 14, marginBottom: 12, gap: 6 },
  bubbleLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, alignSelf: "flex-start", marginBottom: 12 },
  copyBtnText: { fontSize: 14, fontWeight: "600" },
  dateSmall: { fontSize: 12, textAlign: "center", marginBottom: 20 },
});
