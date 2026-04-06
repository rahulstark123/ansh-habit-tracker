import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../theme";
import { useHabits } from "../context/HabitContext";
import { selectionHaptic } from "../utils/haptics";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#06b6d4"];
const ICONS = ["water-outline", "book-outline", "fitness-outline", "musical-notes-outline", "fast-food-outline", "timer-outline", "moon-outline", "sunny-outline"];
const FREQUENCIES = ["Daily", "Weekly", "Monthly"];
const TIMES = ["morning", "afternoon", "evening", "all"];

export default function EditHabitScreen({ route, navigation }) {
  const { habitId } = route.params;
  const theme = useAppTheme();
  const { getHabitById, updateHabit } = useHabits();
  const habit = getHabitById(habitId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [targetValue, setTargetValue] = useState("1");
  const [targetUnit, setTargetUnit] = useState("times");
  const [timeOfDay, setTimeOfDay] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.title || habit.name || "");
      setDescription(habit.description || "");
      setFrequency((habit.frequency ? `${habit.frequency}` : "daily").replace(/^\w/, (c) => c.toUpperCase()));
      setSelectedIcon(habit.icon || ICONS[0]);
      setSelectedColor(habit.color || COLORS[0]);
      setTargetValue(String(habit.targetValue || habit.target || "1"));
      setTargetUnit(habit.targetUnit || "times");
      setTimeOfDay(habit.timeOfDay || "all");
    }
  }, [habit]);

  const handleUpdate = async () => {
    await selectionHaptic();
    if (!name.trim()) {
      Alert.alert("Error", "Please name your habit. 🛡️");
      return;
    }

    setLoading(true);
    const result = await updateHabit(habitId, {
      // Keep both keys for compatibility with older/newer API shapes.
      title: name.trim(),
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
      color: selectedColor,
      frequency: frequency.toLowerCase(),
      targetValue: parseInt(targetValue, 10) || 1,
      targetUnit: targetUnit.trim() || "times",
      timeOfDay,
    });

    if (result.success) {
      navigation.goBack();
    } else {
      Alert.alert("Error", result.error || "Update failed.");
    }
    setLoading(false);
  };

  if (!habit) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Edit Habit 🧪</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>HABIT IDENTITY</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                  placeholder="e.g., Deep Work"
                  placeholderTextColor={theme.colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>DESCRIPTION (OPTIONAL)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                  placeholder="The why behind the habit..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>VISUAL DNA 🎨</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {ICONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      onPress={async () => {
                        await selectionHaptic();
                        setSelectedIcon(icon);
                      }}
                      style={[
                        styles.iconPill,
                        {
                          backgroundColor: selectedIcon === icon ? theme.colors.textPrimary : theme.colors.surface,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <Ionicons name={icon} size={20} color={selectedIcon === icon ? theme.colors.background : theme.colors.textPrimary} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.colorRow}>
                  {COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={async () => {
                        await selectionHaptic();
                        setSelectedColor(color);
                      }}
                      style={[
                        styles.colorCircle,
                        {
                          backgroundColor: color,
                          borderWidth: selectedColor === color ? 3 : 0,
                          borderColor: theme.colors.textPrimary,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>FREQUENCY</Text>
                <View style={styles.pillGrid}>
                  {FREQUENCIES.map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      onPress={async () => {
                        await selectionHaptic();
                        setFrequency(freq);
                      }}
                      style={[
                        styles.freqPill,
                        {
                          backgroundColor: frequency === freq ? theme.colors.textPrimary : theme.colors.surface,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.freqText, { color: frequency === freq ? theme.colors.background : theme.colors.textPrimary }]}>
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>GOAL SETTING 🎯</Text>
                <View style={styles.targetRow}>
                  <TextInput
                    style={[styles.targetInput, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                    keyboardType="numeric"
                    value={targetValue}
                    onChangeText={setTargetValue}
                  />
                  <TextInput
                    style={[styles.targetUnitInput, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                    placeholder="times/glasses/mins"
                    placeholderTextColor={theme.colors.textMuted}
                    value={targetUnit}
                    onChangeText={setTargetUnit}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.textMuted }]}>ROUTINE 🕒</Text>
                <View style={styles.pillGrid}>
                  {TIMES.map((time) => (
                    <TouchableOpacity
                      key={time}
                      onPress={async () => {
                        await selectionHaptic();
                        setTimeOfDay(time);
                      }}
                      style={[
                        styles.freqPill,
                        {
                          backgroundColor: timeOfDay === time ? theme.colors.textPrimary : theme.colors.surface,
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.freqText, { color: timeOfDay === time ? theme.colors.background : theme.colors.textPrimary }]}>
                        {time.charAt(0).toUpperCase() + time.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.colors.textPrimary }]}
              onPress={handleUpdate}
              disabled={loading}
            >
              <Text style={[styles.saveButtonText, { color: theme.colors.background }]}>
                {loading ? "Syncing..." : "Update Habit"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  form: {
    gap: 24,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  input: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    fontSize: 16,
    fontWeight: "600",
  },
  iconPill: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  pillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  freqPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    minWidth: 88,
    alignItems: "center",
  },
  freqText: {
    fontSize: 14,
    fontWeight: "800",
  },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  targetInput: {
    width: 80,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
  },
  targetUnitInput: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "700",
  },
  saveButton: {
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "900",
  },
});
