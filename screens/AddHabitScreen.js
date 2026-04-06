import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { selectionHaptic, successHaptic } from "../utils/haptics";

const { width } = Dimensions.get("window");

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#06b6d4"];
const ICONS = ["water-outline", "book-outline", "fitness-outline", "musical-notes-outline", "fast-food-outline", "timer-outline", "moon-outline", "sunny-outline"];
const FREQUENCIES = ["Daily", "Weekly", "Monthly"];
const TIMES = ["morning", "afternoon", "evening", "all"];

export default function AddHabitScreen({ navigation }) {
  const theme = useAppTheme();
  const { addHabit } = useHabits();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [frequency, setFrequency] = useState("Daily");
  const [targetValue, setTargetValue] = useState("1");
  const [targetUnit, setTargetUnit] = useState("times");
  const [timeOfDay, setTimeOfDay] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = title.trim().length === 0;

  const handleCreate = async () => {
    if (isDisabled) return;
    setIsSubmitting(true);
    
    const result = await addHabit({
      title: title.trim(),
      description: description.trim(),
      icon: selectedIcon,
      color: selectedColor,
      frequency: frequency.toLowerCase(),
      targetValue: parseInt(targetValue) || 1,
      targetUnit,
      timeOfDay,
    });

    if (result.success) {
      await successHaptic();
      navigation.goBack();
    } else {
      alert(result.error || "Failed to create habit");
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>New Habit 🎯</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Preview Card */}
          <View style={[styles.preview, { backgroundColor: selectedColor + "15", borderColor: selectedColor }]}>
            <Ionicons name={selectedIcon} size={30} color={selectedColor} />
            <Text style={[styles.previewText, { color: selectedColor }]}>
              {title || "Morning Habit ✨"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>NAME & DESCRIPTION</Text>
            <View style={[styles.inputBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.textPrimary }]}
                placeholder="What's the goal? 🔥"
                placeholderTextColor={theme.colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={[styles.inputBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, height: 80, marginTop: 12 }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.textPrimary, height: 60 }]}
                placeholder="Your motivational 'Why'... 🛡️"
                placeholderTextColor={theme.colors.textMuted}
                multiline
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>VISUAL DNA 🎨</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => { selectionHaptic(); setSelectedIcon(icon); }}
                  style={[
                    styles.iconPill, 
                    { backgroundColor: selectedIcon === icon ? theme.colors.textPrimary : theme.colors.surface }
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
                  onPress={() => { selectionHaptic(); setSelectedColor(color); }}
                  style={[
                    styles.colorCircle, 
                    { backgroundColor: color, borderWidth: selectedColor === color ? 3 : 0, borderColor: theme.colors.textPrimary }
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>GOAL SETTING 🎯</Text>
            <View style={styles.goalRow}>
              <View style={[styles.inputBox, { flex: 1, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  keyboardType="numeric"
                  value={targetValue}
                  onChangeText={setTargetValue}
                />
              </View>
              <View style={[styles.inputBox, { flex: 2, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  placeholder="times/glasses/mins"
                  placeholderTextColor={theme.colors.textMuted}
                  value={targetUnit}
                  onChangeText={setTargetUnit}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>ROUTINE 🕒</Text>
            <View style={styles.pillGrid}>
              {TIMES.map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => { selectionHaptic(); setTimeOfDay(time); }}
                  style={[
                    styles.freqPill,
                    { 
                      backgroundColor: timeOfDay === time ? theme.colors.textPrimary : theme.colors.surface,
                      borderColor: theme.colors.border
                    }
                  ]}
                >
                  <Text style={[styles.pillText, { color: timeOfDay === time ? theme.colors.background : theme.colors.textPrimary }]}>
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleCreate}
            disabled={isDisabled || isSubmitting}
            activeOpacity={0.9}
            style={[
              styles.createButton, 
              { backgroundColor: theme.colors.textPrimary, opacity: isDisabled ? 0.5 : 1 }
            ]}
          >
            <Text style={[styles.createButtonText, { color: theme.colors.background }]}>
              {isSubmitting ? "Syncing..." : "Create Life Habit 🔥"}
            </Text>
          </TouchableOpacity>
        </View>
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
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
  },
  preview: {
    height: 120,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    gap: 10,
  },
  previewText: {
    fontSize: 20,
    fontWeight: "900",
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  inputBox: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    fontWeight: "600",
  },
  pillScroll: {
    marginBottom: 16,
  },
  iconPill: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  goalRow: {
    flexDirection: "row",
    gap: 12,
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
    borderWidth: 1,
    minWidth: 80,
    alignItems: "center",
  },
  pillText: {
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
  },
  createButton: {
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
