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
import { Reminder, useApp } from "@/contexts/AppContext";

function formatDate(isoString: string) {
  const d = new Date(isoString);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  const formatted = d.toLocaleDateString("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  if (days < 0) return `${formatted} (passerat)`;
  if (days === 0) return "Idag";
  if (days === 1) return "Imorgon";
  return formatted;
}

function isOverdue(isoString: string) {
  return new Date(isoString) < new Date();
}

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, date: string) => void;
}

function ReminderModal({ visible, onClose, onSave }: ReminderModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStr, setDateStr] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Rubrik krävs", "Vänligen ange en rubrik.");
      return;
    }
    if (!dateStr.trim()) {
      Alert.alert("Datum krävs", "Vänligen ange ett datum (ÅÅÅÅ-MM-DD).");
      return;
    }
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      Alert.alert("Ogiltigt datum", "Ange datum i formatet ÅÅÅÅ-MM-DD.");
      return;
    }
    onSave(title.trim(), description.trim(), parsed.toISOString());
    setTitle("");
    setDescription("");
    setDateStr("");
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
            style={[styles.modalTitle, { color: theme.text, fontFamily: "Inter_600SemiBold" }]}
          >
            Ny påminnelse
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
        <View style={styles.modalBody}>
          <View style={[styles.inputGroup, { borderColor: theme.cardBorder, backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_500Medium" }]}>
              Rubrik
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="T.ex. Sista dag att svara"
              placeholderTextColor={theme.textTertiary}
              style={[styles.input, { color: theme.text, fontFamily: "Inter_400Regular" }]}
            />
          </View>
          <View style={[styles.inputGroup, { borderColor: theme.cardBorder, backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_500Medium" }]}>
              Beskrivning (valfritt)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Extra detaljer..."
              placeholderTextColor={theme.textTertiary}
              multiline
              style={[styles.input, { color: theme.text, fontFamily: "Inter_400Regular" }]}
            />
          </View>
          <View style={[styles.inputGroup, { borderColor: theme.cardBorder, backgroundColor: theme.card }]}>
            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: "Inter_500Medium" }]}>
              Datum (ÅÅÅÅ-MM-DD)
            </Text>
            <TextInput
              value={dateStr}
              onChangeText={setDateStr}
              placeholder="2026-04-15"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numeric"
              style={[styles.input, { color: theme.text, fontFamily: "Inter_400Regular" }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ReminderCard({ reminder }: { reminder: Reminder }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const { deleteReminder, toggleReminderComplete } = useApp();
  const overdue = isOverdue(reminder.date) && !reminder.completed;

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleReminderComplete(reminder.id);
  };

  const handleDelete = () => {
    Alert.alert("Ta bort påminnelse", "Är du säker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Ta bort",
        style: "destructive",
        onPress: () => deleteReminder(reminder.id),
      },
    ]);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: overdue ? theme.danger : theme.cardBorder,
          borderLeftWidth: 3,
          borderLeftColor: reminder.completed
            ? theme.success
            : overdue
            ? theme.danger
            : Colors.primary,
        },
      ]}
    >
      <Pressable onPress={handleToggle} style={styles.checkArea}>
        <View
          style={[
            styles.check,
            {
              borderColor: reminder.completed ? theme.success : theme.textTertiary,
              backgroundColor: reminder.completed ? theme.success : "transparent",
            },
          ]}
        >
          {reminder.completed && (
            <Feather name="check" size={12} color="#fff" />
          )}
        </View>
      </Pressable>
      <View style={styles.cardContent}>
        <Text
          style={[
            styles.cardTitle,
            {
              color: reminder.completed ? theme.textTertiary : theme.text,
              fontFamily: "Inter_600SemiBold",
              textDecorationLine: reminder.completed ? "line-through" : "none",
            },
          ]}
        >
          {reminder.title}
        </Text>
        {reminder.description ? (
          <Text
            style={[
              styles.cardDesc,
              { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
            ]}
            numberOfLines={1}
          >
            {reminder.description}
          </Text>
        ) : null}
        <View style={styles.dateRow}>
          <Feather
            name="calendar"
            size={12}
            color={overdue ? theme.danger : theme.textTertiary}
          />
          <Text
            style={[
              styles.dateText,
              {
                color: overdue ? theme.danger : theme.textTertiary,
                fontFamily: "Inter_400Regular",
              },
            ]}
          >
            {formatDate(reminder.date)}
          </Text>
        </View>
      </View>
      <Pressable onPress={handleDelete} hitSlop={8}>
        <Feather name="trash-2" size={16} color={theme.danger} />
      </Pressable>
    </View>
  );
}

export default function RemindersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { reminders, addReminder } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const active = reminders.filter((r) => !r.completed);
  const completed = reminders.filter((r) => r.completed);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 80 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {active.length > 0 && (
              <Text
                style={[
                  styles.sectionLabel,
                  { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" },
                ]}
              >
                AKTIVA ({active.length})
              </Text>
            )}
          </>
        }
        renderItem={({ item, index }) => {
          const isFirstCompleted =
            item.completed &&
            (index === 0 || !reminders[index - 1]?.completed);
          return (
            <>
              {isFirstCompleted && completed.length > 0 && (
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" },
                  ]}
                >
                  SLUTFÖRDA ({completed.length})
                </Text>
              )}
              <ReminderCard reminder={item} />
            </>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bell" size={44} color={theme.textTertiary} />
            <Text
              style={[
                styles.emptyTitle,
                { color: theme.text, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              Inga påminnelser
            </Text>
            <Text
              style={[
                styles.emptySub,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              Tryck + för att lägga till en påminnelse
            </Text>
          </View>
        }
      />
      <Pressable
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        style={[
          styles.fab,
          { backgroundColor: Colors.primary, bottom: bottomPad + 16 },
        ]}
      >
        <Feather name="plus" size={24} color="#fff" />
      </Pressable>

      <ReminderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(title, description, date) =>
          addReminder({ title, description, date, completed: false })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 10 },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 12,
  },
  checkArea: { paddingTop: 2 },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 15 },
  cardDesc: { fontSize: 13 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  dateText: { fontSize: 12 },
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
  },
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
});
