import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";

export default function HabitDetailScreen({ route }) {
  const { habitId } = route.params;
  const theme = useAppTheme();
  const { getHabitById } = useHabits();

  const habit = getHabitById(habitId);

  if (!habit) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.notFound, { color: theme.colors.textSecondary }]}>Habit not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completionRate = Math.round((habit.completedCount / habit.totalCount) * 100);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>{habit.name}</Text>
        <Text style={[styles.frequency, { color: theme.colors.textSecondary }]}>{habit.frequency}</Text>

        <View style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.heroHeader}>
            <Ionicons name="flame-outline" size={15} color={theme.colors.textSecondary} />
            <Text style={[styles.heroLabel, { color: theme.colors.textSecondary }]}>Current Streak</Text>
          </View>
          <Text style={[styles.heroValue, { color: theme.colors.textPrimary }]}>🔥 {habit.streak} days</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.statHeader}>
              <Ionicons name="pie-chart-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Completion Rate</Text>
            </View>
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{completionRate}%</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.statHeader}>
              <Ionicons name="checkmark-done-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Completions</Text>
            </View>
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{habit.completedCount}</Text>
          </View>
        </View>
      </View>
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
  frequency: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "500"
  },
  heroCard: {
    borderRadius: 12,
    padding: 18,
    marginTop: 26
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 0
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8
  },
  heroValue: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.4
  },
  statsGrid: {
    marginTop: 14,
    gap: 12
  },
  statCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 0
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.2
  },
  notFound: {
    fontSize: 16,
    fontWeight: "500"
  }
});
