import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { getWeeklyStats } from "../utils/metrics";

function DayBar({ day, theme }) {
  const ratio = day.total > 0 ? day.value / day.total : 0;
  const height = Math.max(10, Math.round(84 * ratio));

  return (
    <View style={styles.dayColumn}>
      <View style={[styles.track, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={[styles.fill, { height, backgroundColor: theme.colors.textPrimary }]} />
      </View>
      <Text style={[styles.dayLabel, { color: theme.colors.textSecondary }]}>{day.label}</Text>
    </View>
  );
}

function StatCard({ label, value, theme, icon }) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={14} color={theme.colors.textSecondary} />
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

export default function WeekScreen() {
  const theme = useAppTheme();
  const { habits } = useHabits();
  const weekly = getWeeklyStats(habits);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>Week</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Consistency over last 7 days.</Text>

        <View style={[styles.chartCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.chartRow}>
            {weekly.weekly.map((day) => (
              <DayBar key={day.label} day={day} theme={theme} />
            ))}
          </View>
        </View>

        <View style={styles.statList}>
          <StatCard label="Weekly Completion" value={`${weekly.weekRate}%`} icon="pie-chart-outline" theme={theme} />
          <StatCard
            label="Best Day"
            value={`${weekly.bestDay.label} (${weekly.bestDay.value}/${weekly.bestDay.total})`}
            icon="trending-up-outline"
            theme={theme}
          />
          <StatCard
            label="Needs Attention"
            value={`${weekly.lowDay.label} (${weekly.lowDay.value}/${weekly.lowDay.total})`}
            icon="alert-circle-outline"
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
  chartCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dayColumn: {
    alignItems: "center",
    width: 34
  },
  track: {
    width: 18,
    height: 88,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "flex-end",
    paddingBottom: 3,
    marginBottom: 6
  },
  fill: {
    marginHorizontal: 3,
    borderRadius: 999
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600"
  },
  statList: {
    gap: 10
  },
  statCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 0
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5
  },
  statValue: {
    fontSize: 17,
    fontWeight: "700"
  }
});
