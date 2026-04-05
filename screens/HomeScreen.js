import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import FloatingActionButton from "../components/FloatingActionButton";
import HabitCard from "../components/HabitCard";
import InsightCarousel from "../components/InsightCarousel";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { getQuoteOfTheDay } from "../utils/dailyQuote";
import { getHabitSummary, getWeeklyStats } from "../utils/metrics";
import { selectionHaptic } from "../utils/haptics";

const FILTERS = ["All", "Pending", "Done"];

export default function HomeScreen({ navigation }) {
  const theme = useAppTheme();
  const { habits, toggleHabit } = useHabits();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState("All");
  const cardWidth = Math.max(260, width - 48);
  const summary = useMemo(() => getHabitSummary(habits), [habits]);
  const weekly = useMemo(() => getWeeklyStats(habits), [habits]);
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
  const dailyQuote = useMemo(() => getQuoteOfTheDay(new Date()), [todayLabel]);

  async function handleToggle(habitId) {
    await selectionHaptic();
    toggleHabit(habitId);
  }

  const filteredHabits = habits.filter((habit) => {
    if (filter === "Pending") {
      return !habit.completedToday;
    }
    if (filter === "Done") {
      return habit.completedToday;
    }
    return true;
  });

  const focusHabit = habits.find((habit) => !habit.completedToday) ?? habits[0];

  const cards = [
    {
      title: "Today's Completion",
      value: `${summary.todayCompletionRate}%`,
      caption: `${summary.completedToday}/${summary.totalHabits} habits checked`,
      icon: "pie-chart-outline",
      chartPercent: summary.todayCompletionRate
    },
    {
      title: "Streak Summary",
      value: `${summary.bestStreak} days`,
      caption: `${summary.totalStreakDays} total streak days`,
      icon: "flame-outline",
      chartPercent: Math.min(100, summary.bestStreak * 5)
    },
    {
      title: "Weekly Pace",
      value: `${weekly.weekRate}%`,
      caption: `${weekly.bestDay.label} is your strongest day`,
      icon: "bar-chart-outline",
      chartPercent: weekly.weekRate
    }
  ];

  async function openWeekTab() {
    await selectionHaptic();
    navigation.getParent()?.navigate("Week");
  }

  async function openMilestones() {
    await selectionHaptic();
    navigation.navigate("Milestones");
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: 160 + insets.bottom }]}
          contentInsetAdjustmentBehavior="automatic"
          ListHeaderComponent={
            <View style={styles.headerWrap}>
              <Text style={[styles.dateLabel, { color: theme.colors.textMuted }]}>{todayLabel}</Text>
              <Text style={[theme.typography.title, { color: theme.colors.textPrimary }]}>Today</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Keep your daily momentum.</Text>

              <View style={[styles.quoteCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.quoteHeader}>
                  <Ionicons name="sparkles-outline" size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.quoteTitle, { color: theme.colors.textSecondary }]}>Quote of the Day</Text>
                </View>
                <Text style={[styles.quoteText, { color: theme.colors.textPrimary }]}>"{dailyQuote.text}"</Text>
                <Text style={[styles.quoteAuthor, { color: theme.colors.textMuted }]}>- {dailyQuote.author}</Text>
              </View>

              <InsightCarousel cards={cards} cardWidth={cardWidth} />

              <View style={styles.quickActionsRow}>
                <Pressable
                  style={[styles.quickAction, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  onPress={openWeekTab}
                >
                  <View style={styles.quickActionHeader}>
                    <Ionicons name="calendar-outline" size={15} color={theme.colors.textPrimary} />
                    <Text style={[styles.quickActionTitle, { color: theme.colors.textPrimary }]}>Week View</Text>
                  </View>
                  <Text style={[styles.quickActionCaption, { color: theme.colors.textMuted }]}>
                    {weekly.bestDay.value}/{weekly.bestDay.total} best day
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.quickAction, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  onPress={openMilestones}
                >
                  <View style={styles.quickActionHeader}>
                    <Ionicons name="trophy-outline" size={15} color={theme.colors.textPrimary} />
                    <Text style={[styles.quickActionTitle, { color: theme.colors.textPrimary }]}>Milestones</Text>
                  </View>
                  <Text style={[styles.quickActionCaption, { color: theme.colors.textMuted }]}>
                    {summary.bestStreak} day best streak
                  </Text>
                </Pressable>
              </View>

              {focusHabit ? (
                <View style={[styles.focusCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <View style={styles.focusHeader}>
                    <Ionicons name="sparkles-outline" size={14} color={theme.colors.textSecondary} />
                    <Text style={[styles.focusLabel, { color: theme.colors.textSecondary }]}>Focus Habit</Text>
                  </View>
                  <Text style={[styles.focusValue, { color: theme.colors.textPrimary }]}>{focusHabit.name}</Text>
                  <Text style={[styles.focusCaption, { color: theme.colors.textMuted }]}>
                    {focusHabit.completedToday ? "Completed today" : "Next best action right now"}
                  </Text>
                </View>
              ) : null}

              <View style={styles.filterRow}>
                {FILTERS.map((item) => {
                  const active = item === filter;
                  return (
                    <Pressable
                      key={item}
                      onPress={() => setFilter(item)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: active ? theme.colors.textPrimary : theme.colors.surface,
                          borderColor: active ? theme.colors.textPrimary : theme.colors.border
                        }
                      ]}
                    >
                      <Text style={[styles.filterText, { color: active ? theme.colors.background : theme.colors.textSecondary }]}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onToggle={handleToggle}
              onOpenDetail={(habitId) => navigation.navigate("HabitDetail", { habitId })}
            />
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>No habits in this filter yet.</Text>
          }
        />
      </View>

      <FloatingActionButton onPress={() => navigation.navigate("AddHabit")} bottomOffset={102 + insets.bottom} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 24
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 15,
    fontWeight: "500"
  },
  listContent: {},
  headerWrap: {
    marginBottom: 8
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  quickAction: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 0
  },
  quickActionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4
  },
  quickActionCaption: {
    fontSize: 12,
    fontWeight: "500"
  },
  focusCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 12
  },
  focusLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4
  },
  focusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  focusValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4
  },
  focusCaption: {
    fontSize: 13,
    fontWeight: "500"
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 34,
    justifyContent: "center"
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700"
  },
  emptyText: {
    marginTop: 24,
    fontSize: 15,
    fontWeight: "500"
  },
  quoteCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12
  },
  quoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8
  },
  quoteTitle: {
    fontSize: 13,
    fontWeight: "700"
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 8
  },
  quoteAuthor: {
    fontSize: 13,
    fontWeight: "600"
  }
});
