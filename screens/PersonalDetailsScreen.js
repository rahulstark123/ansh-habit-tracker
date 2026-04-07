import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme";
import { selectionHaptic } from "../utils/haptics";
import { FOCUS_TIME_OPTIONS, getOptionLabel, GOAL_OPTIONS, LEVEL_OPTIONS } from "../utils/profileOptions";

const { width } = Dimensions.get("window");

function DetailItem({ icon, label, value, theme }) {
  return (
    <View style={[styles.detailBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.card }]}>
        <Ionicons name={icon} size={20} color={theme.colors.textPrimary} />
      </View>
      <View style={styles.detailInfo}>
        <Text style={[styles.detailLabel, { color: theme.colors.textMuted }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}

function PickerField({ label, value, onPress, theme }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>{label}</Text>
      <TouchableOpacity onPress={onPress} style={[styles.pickerInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.pickerInputText, { color: theme.colors.textPrimary }]}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

export default function PersonalDetailsScreen({ navigation }) {
  const theme = useAppTheme();
  const { user, updateProfile } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [focusTime, setFocusTime] = useState("");
  const [activePicker, setActivePicker] = useState(null);

  useEffect(() => {
    setName(user?.name || "");
    setGoal(user?.goal || "");
    setLevel(user?.level || "");
    setFocusTime(user?.focusTime || "");
  }, [user]);

  const joinDate = useMemo(() => {
    if (!user?.createdAt) return "Lifetime Member";
    const date = new Date(user.createdAt);
    return date.toLocaleDateString("en-US", { day: 'numeric', month: "long", year: "numeric" });
  }, [user]);

  const handleBack = async () => {
    await selectionHaptic();
    navigation.goBack();
  };

  const openEdit = async () => {
    await selectionHaptic();
    setShowEditModal(true);
  };

  const handleSave = async () => {
    await selectionHaptic();
    if (!name.trim()) {
      Alert.alert("Error", "Name is required.");
      return;
    }

    setSaving(true);
    const result = await updateProfile({
      name: name.trim(),
      goal: goal.trim(),
      level: level.trim(),
      focusTime: focusTime.trim(),
    });
    setSaving(false);

    if (result.success) {
      setShowEditModal(false);
      return;
    }
    Alert.alert("Error", result.error || "Failed to update profile.");
  };

  const pickerOptions =
    activePicker === "goal"
      ? GOAL_OPTIONS
      : activePicker === "level"
        ? LEVEL_OPTIONS
        : activePicker === "focusTime"
          ? FOCUS_TIME_OPTIONS
          : [];

  const pickerTitle =
    activePicker === "goal"
      ? "Select Goal"
      : activePicker === "level"
        ? "Select Level"
        : activePicker === "focusTime"
          ? "Select Focus Time"
          : "";

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Identity Details ✨</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Identity Card */}
          <View style={[styles.heroCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.avatarText, { color: theme.colors.textPrimary }]}>
                {user?.name?.charAt(0) || "U"}
              </Text>
            </View>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>{user?.name || "User Name"}</Text>
              <TouchableOpacity onPress={openEdit} style={[styles.nameEditBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Ionicons name="create-outline" size={14} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.userEmail, { color: theme.colors.textMuted }]}>{user?.email || "email@example.com"}</Text>
            
            <View style={styles.identityBadges}>
              <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="shield-checkmark" size={12} color={theme.colors.textPrimary} />
                <Text style={[styles.badgeText, { color: theme.colors.textPrimary }]}>Verified Account</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>GROWTH PROFILE 🛡️</Text>
          
          <DetailItem 
            icon="compass" 
            label="Habitual Goal" 
            value={getOptionLabel(GOAL_OPTIONS, user?.goal, "Building Habits 🔨")} 
            theme={theme} 
          />
          
          <DetailItem 
            icon="school" 
            label="Experience Level" 
            value={getOptionLabel(LEVEL_OPTIONS, user?.level, "Beginner 🌱")} 
            theme={theme} 
          />
          
          <DetailItem 
            icon="timer" 
            label="Focus Window" 
            value={getOptionLabel(FOCUS_TIME_OPTIONS, user?.focusTime, "All Day 🕒")} 
            theme={theme} 
          />

          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>ACCOUNT JOURNEY 📅</Text>
          
          <DetailItem 
            icon="calendar" 
            label="Member Since" 
            value={joinDate} 
            theme={theme} 
          />
          
          <DetailItem 
            icon="hardware-chip" 
            label="Account Status" 
            value="Premium Access Activated 💎" 
            theme={theme} 
          />

          <View style={styles.footerInfo}>
            <Ionicons name="lock-closed-outline" size={14} color={theme.colors.textMuted} />
            <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
              Your data is encrypted and secure with Ansh Cloud 🛡️
            </Text>
          </View>
        </ScrollView>

        <Modal visible={showEditModal} transparent animationType="fade" onRequestClose={() => setShowEditModal(false)}>
          <View style={styles.sheetOverlay}>
            <Pressable style={styles.sheetBackdrop} onPress={() => setShowEditModal(false)} />
            <View style={[styles.sheetCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Edit Profile</Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>NAME</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
                />
              </View>

              <PickerField
                label="GOAL"
                value={getOptionLabel(GOAL_OPTIONS, goal, "Select goal")}
                onPress={() => setActivePicker("goal")}
                theme={theme}
              />
              <PickerField
                label="LEVEL"
                value={getOptionLabel(LEVEL_OPTIONS, level, "Select level")}
                onPress={() => setActivePicker("level")}
                theme={theme}
              />
              <PickerField
                label="FOCUS TIME"
                value={getOptionLabel(FOCUS_TIME_OPTIONS, focusTime, "Select focus time")}
                onPress={() => setActivePicker("focusTime")}
                theme={theme}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  style={[styles.modalSecondaryBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                >
                  <Text style={[styles.modalSecondaryText, { color: theme.colors.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={[styles.modalPrimaryBtn, { backgroundColor: theme.colors.textPrimary }]}>
                  <Text style={[styles.modalPrimaryText, { color: theme.colors.background }]}>{saving ? "Saving..." : "Save"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={!!activePicker} transparent animationType="fade" onRequestClose={() => setActivePicker(null)}>
          <View style={styles.sheetOverlay}>
            <Pressable style={styles.sheetBackdrop} onPress={() => setActivePicker(null)} />
            <View style={[styles.pickerSheetCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>{pickerTitle}</Text>
              <View style={styles.optionList}>
                {pickerOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => {
                      if (activePicker === "goal") setGoal(option.id);
                      if (activePicker === "level") setLevel(option.id);
                      if (activePicker === "focusTime") setFocusTime(option.id);
                      setActivePicker(null);
                    }}
                    style={[styles.optionRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  >
                    <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => setActivePicker(null)}
                style={[styles.modalSecondaryBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginTop: 8 }]}
              >
                <Text style={[styles.modalSecondaryText, { color: theme.colors.textPrimary }]}>Close</Text>
              </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
  },
  heroCard: {
    padding: 30,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "900",
  },
  userName: {
    fontSize: 22,
    fontWeight: "900",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  nameEditBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  identityBadges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  detailBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 22,
    borderWidth: 1.5,
    marginBottom: 12,
    gap: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "800",
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 11,
    fontWeight: "600",
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 22,
    maxHeight: "82%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "700",
  },
  pickerInput: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerInputText: {
    fontSize: 14,
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  modalSecondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSecondaryText: {
    fontSize: 14,
    fontWeight: "800",
  },
  modalPrimaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalPrimaryText: {
    fontSize: 14,
    fontWeight: "900",
  },
  pickerSheetCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 22,
    maxHeight: "70%",
  },
  optionList: {
    gap: 8,
    marginTop: 6,
  },
  optionRow: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
