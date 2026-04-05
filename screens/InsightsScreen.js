import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { getHabitSummary } from "../utils/metrics";
import { selectionHaptic } from "../utils/haptics";

export default function InsightsScreen({ navigation }) {
  const theme = useAppTheme();
  const { habits } = useHabits();
  const summary = getHabitSummary(habits);

  async function openMilestones() {
    await selectionHaptic();
    navigation.navigate("Milestones");
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>Insights</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>A quick view of your consistency.</Text>

        <View style={styles.list}>
          <MetricCard label="Done Today" value={`${summary.completedToday}/${summary.totalHabits}`} icon="checkmark-circle-outline" theme={theme} />
          <MetricCard label="Average Streak" value={`${summary.avgStreak} days`} icon="flame-outline" theme={theme} />
          <MetricCard label="Total Completion Rate" value={`${summary.totalCompletionRate}%`} icon="pie-chart-outline" theme={theme} />
        </View>

        <Pressable
          onPress={openMilestones}
          style={[styles.linkCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <View style={styles.linkHeader}>
            <Ionicons name="trophy-outline" size={15} color={theme.colors.textPrimary} />
            <Text style={[styles.linkTitle, { color: theme.colors.textPrimary }]}>Open Milestones</Text>
          </View>
          <Text style={[styles.linkCaption, { color: theme.colors.textMuted }]}>
            Track 7-day, 21-day and 100-completion targets.
          </Text>
        </Pressable>
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
    marginBottom: 18,
    fontSize: 15,
    fontWeight: "500"
  },
  list: {
    gap: 12,
    marginBottom: 12
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 0
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8
  },
  value: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3
  },
  linkCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 0
  },
  linkHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5
  },
  linkCaption: {
    fontSize: 13,
    fontWeight: "500"
  }
});

function MetricCard({ label, value, theme, icon }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
        }
      ]}
    >
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={14} color={theme.colors.textSecondary} />
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.textPrimary }]}>{value}</Text>
    </View>
  );
}
