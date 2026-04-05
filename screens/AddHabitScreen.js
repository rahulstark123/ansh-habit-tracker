import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import FrequencyBottomSheet from "../components/FrequencyBottomSheet";
import Input from "../components/Input";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { selectionHaptic, successHaptic } from "../utils/haptics";
import { useState } from "react";

export default function AddHabitScreen({ navigation }) {
  const theme = useAppTheme();
  const { addHabit } = useHabits();

  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [showSheet, setShowSheet] = useState(false);

  const isDisabled = habitName.trim().length === 0;

  async function handleCreateHabit() {
    if (isDisabled) {
      return;
    }
    addHabit({ name: habitName, frequency });
    await successHaptic();
    navigation.goBack();
  }

  async function openFrequencySheet() {
    await selectionHaptic();
    setShowSheet(true);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>Add Habit</Text>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Ionicons name="create-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Habit Name</Text>
          </View>
          <Input value={habitName} onChangeText={setHabitName} placeholder="Morning Walk" />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Ionicons name="repeat-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Frequency</Text>
          </View>
          <Pressable
            onPress={openFrequencySheet}
            style={[
              styles.frequencyInput,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface
              }
            ]}
          >
            <Text style={[styles.frequencyText, { color: theme.colors.textPrimary }]}>{frequency}</Text>
            <Ionicons name="chevron-down" size={17} color={theme.colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.buttonWrap}>
          <Button title="Create Habit" onPress={handleCreateHabit} disabled={isDisabled} />
        </View>
      </View>

      <FrequencyBottomSheet
        visible={showSheet}
        selected={frequency}
        onSelect={setFrequency}
        onClose={() => setShowSheet(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8
  },
  fieldGroup: {
    marginTop: 24
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 0
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10
  },
  frequencyInput: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  frequencyText: {
    fontSize: 16,
    fontWeight: "500"
  },
  buttonWrap: {
    marginTop: "auto",
    marginBottom: 26
  }
});
