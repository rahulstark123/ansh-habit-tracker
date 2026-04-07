import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { selectionHaptic } from "../utils/haptics";

export default function HabitDetailScreen({ route, navigation }) {
  const { habitId } = route.params;
  const theme = useAppTheme();
  const { getHabitById, deleteHabit } = useHabits();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const habit = getHabitById(habitId);

  const handleDelete = async () => {
    await selectionHaptic();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await selectionHaptic();
    setShowDeleteModal(false);
    await deleteHabit(habitId);
    navigation.goBack();
  };

  const handleEdit = async () => {
    await selectionHaptic();
    navigation.navigate("EditHabit", { habitId });
  };

  if (!habit) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.notFound, { color: theme.colors.textSecondary }]}>Habit not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completionRate = habit.totalCount > 0 ? Math.round((habit.completedCount / habit.totalCount) * 100) : 0;
  const habitTitle = habit.title || habit.name || "Untitled Habit";
  const habitFrequency = `${habit.frequency || "daily"}`.replace(/^\w/, (c) => c.toUpperCase());
  const habitIcon = habit.icon || "star-outline";
  const habitColor = habit.color || theme.colors.textPrimary;
  const targetValue = habit.targetValue || habit.target || 1;
  const targetUnit = habit.targetUnit || "times";
  const routine = habit.timeOfDay ? `${habit.timeOfDay}`.replace(/^\w/, (c) => c.toUpperCase()) : "All";
  const reminderLabel = habit.reminderTime ? habit.reminderTime : "Off";
  const reminderRepeat = habit.reminderRepeat === "once" ? "Once" : "Daily";

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Habit Depth 🧬</Text>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={[styles.mainCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.titleRow}>
                <View style={[styles.iconBadge, { backgroundColor: habitColor + "20" }]}>
                  <Ionicons name={habitIcon} size={18} color={habitColor} />
                </View>
                <View style={styles.titleTextWrap}>
                  <Text style={[styles.habitName, { color: theme.colors.textPrimary }]}>{habitTitle}</Text>
                  <Text style={[styles.habitFreq, { color: theme.colors.textMuted }]}>{habitFrequency} habit</Text>
                </View>
              </View>

              <View style={styles.metaGrid}>
                <View style={[styles.metaPill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Ionicons name="flag-outline" size={14} color={theme.colors.textMuted} />
                  <Text style={[styles.metaText, { color: theme.colors.textPrimary }]}>
                    {targetValue} {targetUnit}
                  </Text>
                </View>
                <View style={[styles.metaPill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Ionicons name="sunny-outline" size={14} color={theme.colors.textMuted} />
                  <Text style={[styles.metaText, { color: theme.colors.textPrimary }]}>{routine}</Text>
                </View>
                <View style={[styles.metaPill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Ionicons name="alarm-outline" size={14} color={theme.colors.textMuted} />
                  <Text style={[styles.metaText, { color: theme.colors.textPrimary }]}>
                    {reminderLabel === "Off" ? "Off" : `${reminderLabel} (${reminderRepeat})`}
                  </Text>
                </View>
              </View>
              {habit.description ? (
                <Text style={[styles.habitDesc, { color: theme.colors.textMuted }]}>{habit.description}</Text>
              ) : null}
            </View>

            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Ionicons name="flame" size={20} color="#f59e0b" />
                <Text style={[styles.statVal, { color: theme.colors.textPrimary }]}>{habit.streak}</Text>
                <Text style={[styles.statLab, { color: theme.colors.textMuted }]}>BEST STREAK</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Ionicons name="pie-chart" size={20} color="#10b981" />
                <Text style={[styles.statVal, { color: theme.colors.textPrimary }]}>{completionRate}%</Text>
                <Text style={[styles.statLab, { color: theme.colors.textMuted }]}>CONSISTENCY</Text>
              </View>
            </View>

            <View style={[styles.actionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.actionTitle, { color: theme.colors.textPrimary }]}>Habit Management</Text>
              <Text style={[styles.actionDesc, { color: theme.colors.textMuted }]}>Adjust your goals or remove this habit from your library.</Text>
              
              <View style={styles.btnRow}>
                <TouchableOpacity
                  onPress={handleEdit}
                  style={[styles.actionBtn, { backgroundColor: theme.colors.textPrimary }]}
                >
                  <Text style={[styles.actionBtnText, { color: theme.colors.background }]}>Edit Habit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleDelete}
                  style={[styles.deleteBtn, { borderColor: theme.colors.border }]}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </View>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Delete Habit?</Text>
              <Text style={[styles.modalDesc, { color: theme.colors.textMuted }]}>
                This will remove this habit and its momentum history from your library.
              </Text>
              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(false)}
                  style={[styles.modalBtnSecondary, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                >
                  <Text style={[styles.modalBtnSecondaryText, { color: theme.colors.textPrimary }]}>Keep It</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmDelete} style={styles.modalBtnDanger}>
                  <Text style={styles.modalBtnDangerText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
  },
  mainCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  habitName: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  habitFreq: {
    fontSize: 14,
    fontWeight: "700",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  titleTextWrap: {
    flex: 1,
    gap: 2,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "800",
  },
  habitDesc: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 8,
  },
  statVal: {
    fontSize: 20,
    fontWeight: "900",
  },
  statLab: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  actionCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
    marginTop: 20,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "900",
  },
  deleteBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 28,
    borderWidth: 1.5,
    padding: 22,
    alignItems: "center",
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef444420",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  modalBtnSecondary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnSecondaryText: {
    fontSize: 15,
    fontWeight: "800",
  },
  modalBtnDanger: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnDangerText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
  notFound: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 100,
  },
});
