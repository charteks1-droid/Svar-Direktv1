import { Feather } from "@expo/vector-icons";
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
import { Note, useApp } from "@/contexts/AppContext";

function formatDate(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface NoteModalProps {
  visible: boolean;
  note?: Note | null;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

function NoteModal({ visible, note, onClose, onSave }: NoteModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");

  React.useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
  }, [note, visible]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave(title.trim() || "Namnlös anteckning", content.trim());
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
        style={[
          styles.modalContainer,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <View
          style={[
            styles.modalHeader,
            {
              paddingTop: insets.top + 16,
              borderBottomColor: theme.separator,
            },
          ]}
        >
          <Pressable onPress={onClose} style={styles.modalBtn}>
            <Text
              style={[
                styles.modalBtnText,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              Avbryt
            </Text>
          </Pressable>
          <Text
            style={[
              styles.modalTitle,
              { color: theme.text, fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {note ? "Redigera" : "Ny anteckning"}
          </Text>
          <Pressable onPress={handleSave} style={styles.modalBtn}>
            <Text
              style={[
                styles.modalBtnText,
                { color: Colors.primary, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              Spara
            </Text>
          </Pressable>
        </View>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Rubrik"
          placeholderTextColor={theme.textTertiary}
          style={[
            styles.titleInput,
            { color: theme.text, fontFamily: "Inter_700Bold", borderBottomColor: theme.separator },
          ]}
        />
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Skriv din anteckning här..."
          placeholderTextColor={theme.textTertiary}
          multiline
          textAlignVertical="top"
          style={[
            styles.contentInput,
            { color: theme.text, fontFamily: "Inter_400Regular" },
          ]}
        />
      </View>
    </Modal>
  );
}

function NoteCard({ note, onEdit, onDelete }: { note: Note; onEdit: () => void; onDelete: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <Pressable
      onPress={onEdit}
      style={({ pressed }) => [
        styles.noteCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.noteMain}>
        <Text
          style={[
            styles.noteTitle,
            { color: theme.text, fontFamily: "Inter_600SemiBold" },
          ]}
          numberOfLines={1}
        >
          {note.title}
        </Text>
        <Text
          style={[
            styles.noteContent,
            { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
          ]}
          numberOfLines={2}
        >
          {note.content}
        </Text>
        <Text
          style={[
            styles.noteDate,
            { color: theme.textTertiary, fontFamily: "Inter_400Regular" },
          ]}
        >
          {formatDate(note.updatedAt)}
        </Text>
      </View>
      <Pressable
        onPress={onDelete}
        style={styles.deleteBtn}
        hitSlop={8}
      >
        <Feather name="trash-2" size={18} color={theme.danger} />
      </Pressable>
    </Pressable>
  );
}

export default function NotepadScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleOpenNew = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingNote(null);
    setModalVisible(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Ta bort anteckning", "Är du säker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Ta bort",
        style: "destructive",
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          deleteNote(id);
        },
      },
    ]);
  };

  const handleSave = (title: string, content: string) => {
    if (editingNote) {
      updateNote(editingNote.id, { title, content });
    } else {
      addNote({ title, content });
    }
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
          Anteckningar
        </Text>
        <Pressable
          onPress={handleOpenNew}
          style={[styles.addBtn, { backgroundColor: Colors.primary }]}
        >
          <Feather name="plus" size={20} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="edit-3" size={40} color={theme.textTertiary} />
            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              Inga anteckningar
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              Tryck + för att skapa din första anteckning
            </Text>
          </View>
        }
      />

      <NoteModal
        visible={modalVisible}
        note={editingNote}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { padding: 16, gap: 10 },
  noteCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
  },
  noteMain: { flex: 1, gap: 4 },
  noteTitle: { fontSize: 16 },
  noteContent: { fontSize: 13, lineHeight: 19 },
  noteDate: { fontSize: 11, marginTop: 4 },
  deleteBtn: { paddingTop: 2 },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 18, marginTop: 4 },
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalBtn: { paddingVertical: 4, paddingHorizontal: 4, minWidth: 60 },
  modalBtnText: { fontSize: 16 },
  modalTitle: { fontSize: 17 },
  titleInput: {
    fontSize: 22,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
