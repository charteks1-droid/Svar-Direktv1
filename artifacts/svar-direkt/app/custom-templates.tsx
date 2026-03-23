import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { CustomTemplate, useApp } from "@/contexts/AppContext";

interface TemplateModalProps {
  visible: boolean;
  template?: CustomTemplate | null;
  onClose: () => void;
  onSave: (title: string, category: string, content: string) => void;
}

function TemplateModal({ visible, template, onClose, onSave }: TemplateModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(template?.title ?? "");
  const [category, setCategory] = useState(template?.category ?? "");
  const [content, setContent] = useState(template?.content ?? "");

  React.useEffect(() => {
    setTitle(template?.title ?? "");
    setCategory(template?.category ?? "");
    setContent(template?.content ?? "");
  }, [template, visible]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Fält saknas", "Rubrik och innehåll är obligatoriska.");
      return;
    }
    onSave(title.trim(), category.trim() || "Övrigt", content.trim());
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
            {template ? "Redigera mall" : "Ny mall"}
          </Text>
          <Pressable onPress={handleSave}>
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
        <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
          <View
            style={[
              styles.inputGroup,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: theme.textSecondary, fontFamily: "Inter_500Medium" },
              ]}
            >
              Rubrik
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="T.ex. Klagomål på värmesystem"
              placeholderTextColor={theme.textTertiary}
              style={[
                styles.input,
                { color: theme.text, fontFamily: "Inter_400Regular" },
              ]}
            />
          </View>
          <View
            style={[
              styles.inputGroup,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: theme.textSecondary, fontFamily: "Inter_500Medium" },
              ]}
            >
              Kategori (valfritt)
            </Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="T.ex. Underhåll"
              placeholderTextColor={theme.textTertiary}
              style={[
                styles.input,
                { color: theme.text, fontFamily: "Inter_400Regular" },
              ]}
            />
          </View>
          <View
            style={[
              styles.inputGroup,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: theme.textSecondary, fontFamily: "Inter_500Medium" },
              ]}
            >
              Malltext
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Skriv din mall här. Använd [HAKPARENTESER] för fält som ska bytas ut."
              placeholderTextColor={theme.textTertiary}
              multiline
              textAlignVertical="top"
              style={[
                styles.contentInput,
                { color: theme.text, fontFamily: "Inter_400Regular" },
              ]}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function TemplateCard({
  template,
  onEdit,
  onDelete,
}: {
  template: CustomTemplate;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <Pressable
      onPress={onEdit}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.catBadge, { backgroundColor: "#6c5ce7" + "18" }]}>
          <Text
            style={[
              styles.catText,
              { color: "#6c5ce7", fontFamily: "Inter_600SemiBold" },
            ]}
          >
            {template.category}
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
        {template.title}
      </Text>
      <Text
        style={[
          styles.cardPreview,
          { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
        ]}
        numberOfLines={2}
      >
        {template.content}
      </Text>
      <Pressable
        onPress={onEdit}
        style={styles.editBtn}
      >
        <Feather name="edit-2" size={14} color={Colors.primary} />
        <Text
          style={[
            styles.editBtnText,
            { color: Colors.primary, fontFamily: "Inter_600SemiBold" },
          ]}
        >
          Redigera
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default function CustomTemplatesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { customTemplates, addCustomTemplate, updateCustomTemplate, deleteCustomTemplate } =
    useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleEdit = (t: CustomTemplate) => {
    setEditingTemplate(t);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Ta bort mall", "Är du säker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Ta bort",
        style: "destructive",
        onPress: () => deleteCustomTemplate(id),
      },
    ]);
  };

  const handleSave = (title: string, category: string, content: string) => {
    if (editingTemplate) {
      updateCustomTemplate(editingTemplate.id, { title, category, content });
    } else {
      addCustomTemplate({ title, category, content });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={customTemplates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TemplateCard
            template={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="edit-3" size={44} color={theme.textTertiary} />
            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              Inga egna mallar
            </Text>
            <Text
              style={[
                styles.emptySub,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              Skapa egna mallar anpassade för dina behov
            </Text>
          </View>
        }
      />

      <Pressable
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setEditingTemplate(null);
          setModalVisible(true);
        }}
        style={[
          styles.fab,
          { backgroundColor: Colors.primary, bottom: bottomPad + 16 },
        ]}
      >
        <Feather name="plus" size={24} color="#fff" />
      </Pressable>

      <TemplateModal
        visible={modalVisible}
        template={editingTemplate}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 10 },
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
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catText: { fontSize: 11 },
  cardTitle: { fontSize: 15 },
  cardPreview: { fontSize: 13, lineHeight: 18 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    backgroundColor: Colors.primary + "12",
  },
  editBtnText: { fontSize: 13 },
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
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 18, marginTop: 4 },
  emptySub: { fontSize: 14, textAlign: "center", lineHeight: 20 },
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
  contentInput: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 180,
  },
});
