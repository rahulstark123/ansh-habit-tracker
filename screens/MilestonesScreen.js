import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { getHabitSummary } from "../utils/metrics";

function AchievementRow({ label, target, current, theme, icon }) {
  const done = current >= target;
  const percent = Math.min(100, Math.round((current / target) * 100));

  return (
    <View style={[styles.row, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
      <View style={styles.rowTop}>
        <View style={styles.rowLeft}>
          <Ionicons name={icon} size={14} color={theme.colors.textPrimary} />
          <Text style={[styles.rowLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
        </View>
        <Text style={[styles.rowValue, { color: done ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
          {done ? "Done" : `${percent}%`}
        </Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percent}%`,
              backgroundColor: theme.colors.textPrimary
            }
          ]}
        />
      </View>
    </View>
  );
}

export default function MilestonesScreen() {
  const theme = useAppTheme();
  const { habits } = useHabits();
  const summary = getHabitSummary(habits);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>Milestones</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Progress toward bigger consistency goals.</Text>

        <View style={[styles.heroCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.heroHeader}>
            <Ionicons name="flame-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.heroLabel, { color: theme.colors.textSecondary }]}>Current Best Streak</Text>
          </View>
          <Text style={[styles.heroValue, { color: theme.colors.textPrimary }]}>{summary.bestStreak} days</Text>
        </View>

        <View style={styles.list}>
          <AchievementRow label="7 Day Streak" current={summary.bestStreak} target={7} icon="sparkles-outline" theme={theme} />
          <AchievementRow label="21 Day Streak" current={summary.bestStreak} target={21} icon="trophy-outline" theme={theme} />
          <AchievementRow
            label="100 Total Completions"
            current={summary.totalCompletions}
            target={100}
            icon="checkmark-done-outline"
            theme={theme}
          />
          <AchievementRow
            label="90% Consistency"
            current={summary.totalCompletionRate}
            target={90}
            icon="pie-chart-outline"
            theme={theme}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 15,
    fontWeight: "500"
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 12
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 0
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6
  },
  heroValue: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.4
  },
  list: {
    gap: 10
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "700"
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "700"
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999
  }
});
