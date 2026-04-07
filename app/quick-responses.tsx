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
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { QuickResponse, useApp } from "@/contexts/AppContext";

interface QRModalProps {
  visible: boolean;
  qr?: QuickResponse | null;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

function QRModal({ visible, qr, onClose, onSave }: QRModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(qr?.title ?? "");
  const [content, setContent] = useState(qr?.content ?? "");

  React.useEffect(() => {
    setTitle(qr?.title ?? "");
    setContent(qr?.content ?? "");
  }, [qr, visible]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Fält saknas", "Rubrik och text är obligatoriska.");
      return;
    }
    onSave(title.trim(), content.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[styles.modalContainer, { backgroundColor: theme.backgroundSecondary }]}
      >
        <View
          style={[
            styles.modalHeader,
            { paddingTop: insets.top + 16, borderBottomColor: theme.separator },
          ]}
        >
          <Pressable onPress={onClose}>
            <Text style={[styles.modalBtnText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Avbryt
            </Text>
          </Pressable>
          <Text style={[styles.modalTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
            {qr ? "Redigera svar" : "Nytt snabbsvar"}
          </Text>
          <Pressable onPress={handleSave}>
            <Text style={[styles.modalBtnText, { color: Colors.primary, fontFamily: "Inter_600SemiBold" }]}>
              Spara
            </Text>
          </Pressable>
        </View>
        <View style={styles.modalBody}>
          <View style={[styles.inputGroup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_500Medium" }]}>
              Rubrik
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="T.ex. Bekräftelse mottaget"
              placeholderTextColor={theme.textTertiary}
              style={[styles.input, { color: theme.text, fontFamily: "Inter_400Regular" }]}
            />
          </View>
          <View style={[styles.inputGroup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_500Medium" }]}>
              Svartext
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Tack, vi har tagit emot ditt meddelande..."
              placeholderTextColor={theme.textTertiary}
              multiline
              textAlignVertical="top"
              style={[styles.contentInput, { color: theme.text, fontFamily: "Inter_400Regular" }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function QRCard({ qr }: { qr: QuickResponse }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const { deleteQuickResponse, updateQuickResponse } = useApp();
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(qr.content);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    Alert.alert("Ta bort", "Ta bort detta snabbsvar?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Ta bort",
        style: "destructive",
        onPress: () => deleteQuickResponse(qr.id),
      },
    ]);
  };

  return (
    <>
      <View
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      >
        <View style={styles.cardMain}>
          <Text style={[styles.cardTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
            {qr.title}
          </Text>
          <Text
            style={[styles.cardContent, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}
            numberOfLines={2}
          >
            {qr.content}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <Pressable
            onPress={handleCopy}
            style={[
              styles.actionBtn,
              { backgroundColor: copied ? theme.success + "20" : Colors.primary + "12" },
            ]}
          >
            <Feather name={copied ? "check" : "copy"} size={16} color={copied ? theme.success : Colors.primary} />
          </Pressable>
          <Pressable
            onPress={() => setEditing(true)}
            style={[styles.actionBtn, { backgroundColor: theme.backgroundTertiary }]}
          >
            <Feather name="edit-2" size={16} color={theme.textSecondary} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={[styles.actionBtn, { backgroundColor: theme.danger + "12" }]}
          >
            <Feather name="trash-2" size={16} color={theme.danger} />
          </Pressable>
        </View>
      </View>
      <QRModal
        visible={editing}
        qr={qr}
        onClose={() => setEditing(false)}
        onSave={(title, content) => updateQuickResponse(qr.id, { title, content })}
      />
    </>
  );
}

export default function QuickResponsesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { quickResponses, addQuickResponse } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={quickResponses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <QRCard qr={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="zap" size={44} color={theme.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}>
              Inga snabba svar
            </Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
              Spara korta svar för att kopiera dem snabbt
            </Text>
          </View>
        }
      />
      <Pressable
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        style={[styles.fab, { backgroundColor: Colors.primary, bottom: bottomPad + 16 }]}
      >
        <Feather name="plus" size={24} color="#fff" />
      </Pressable>
      <QRModal
        visible={modalVisible}
        qr={null}
        onClose={() => setModalVisible(false)}
        onSave={(title, content) => addQuickResponse({ title, content })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 12,
  },
  cardMain: { flex: 1, gap: 6 },
  cardTitle: { fontSize: 15 },
  cardContent: { fontSize: 13, lineHeight: 18 },
  cardActions: { gap: 6 },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, marginTop: 4 },
  emptySub: { fontSize: 14, textAlign: "center" },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: { fontSize: 17 },
  modalBtnText: { fontSize: 16 },
  modalBody: { padding: 16, gap: 12 },
  inputGroup: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 4,
  },
  label: { fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" },
  input: { fontSize: 16, minHeight: 36 },
  contentInput: { fontSize: 15, lineHeight: 22, minHeight: 120 },
});
