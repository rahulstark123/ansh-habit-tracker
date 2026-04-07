import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import HabitDetailCard from "../components/HabitDetailCard";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { getHabitSummary } from "../utils/metrics";
import { selectionHaptic } from "../utils/haptics";

const STATUS_FILTERS = ["All", "Pending", "Done"];
const FREQ_FILTERS = ["All", "Daily", "Weekly"];
const SORT_OPTIONS = ["Priority", "Name", "Streak", "Completion"];
const TOP_TABS = ["My Habits", "Achievements"];

function Chip({ label, active, onPress, theme }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.colors.textPrimary : theme.colors.surface,
          borderColor: active ? theme.colors.textPrimary : theme.colors.border
        }
      ]}
    >
      <Text style={[styles.chipText, { color: active ? theme.colors.background : theme.colors.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

export default function HabitsScreen({ navigation }) {
  const theme = useAppTheme();
  const { habits, toggleHabit } = useHabits();
  const summary = useMemo(() => getHabitSummary(habits), [habits]);
  const [activeTab, setActiveTab] = useState("My Habits");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [freqFilter, setFreqFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Priority");

  const filteredHabits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const base = habits.filter((habit) => {
      const hName = habit.title || habit.name || "";
      const byQuery = normalizedQuery.length === 0 || hName.toLowerCase().includes(normalizedQuery);
      const byStatus =
        statusFilter === "All" ||
        (statusFilter === "Done" && habit.completedToday) ||
        (statusFilter === "Pending" && !habit.completedToday);
      const byFreq = freqFilter === "All" || habit.frequency.toLowerCase() === freqFilter.toLowerCase();

      return byQuery && byStatus && byFreq;
    });

    const sorted = [...base];
    sorted.sort((a, b) => {
      const aName = a.title || a.name || "";
      const bName = b.title || b.name || "";
      
      if (sortBy === "Name") return aName.localeCompare(bName);
      if (sortBy === "Streak") return b.streak - a.streak;
      if (sortBy === "Completion") {
        const aRate = a.totalCount > 0 ? a.completedCount / a.totalCount : 0;
        const bRate = b.totalCount > 0 ? b.completedCount / b.totalCount : 0;
        return bRate - aRate;
      }
      return b.streak - a.streak;
    });

    return sorted;
  }, [habits, query, statusFilter, freqFilter, sortBy]);

  const handleToggle = async (id, completed) => {
    await selectionHaptic();
    toggleHabit(id, completed);
  };

  const renderAchievementSection = (section) => {
    const achievedCount = section.data.filter((item) => item.current >= item.target).length;

    return (
      <View key={section.id} style={[styles.achieveCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.achieveHead}>
          <Text style={[styles.achieveTitle, { color: theme.colors.textPrimary }]}>{section.title}</Text>
          <Text style={[styles.achieveCount, { color: theme.colors.textMuted }]}>
            {achievedCount}/{section.data.length} Achieved
          </Text>
        </View>
        <View style={styles.badgeGrid}>
          {section.data.map((item) => {
            const done = item.current >= item.target;
            const percent = Math.min(100, Math.round((item.current / item.target) * 100));

            return (
              <View
                key={item.id}
                style={[
                  styles.badgeItem,
                  {
                    backgroundColor: done ? theme.colors.textPrimary + "14" : theme.colors.surface,
                    borderColor: done ? theme.colors.textPrimary + "40" : theme.colors.border,
                  },
                ]}
              >
                <View style={[styles.badgeIconWrap, { backgroundColor: done ? theme.colors.textPrimary + "24" : theme.colors.card }]}>
                  <Ionicons name={done ? "trophy" : item.icon} size={16} color={done ? theme.colors.textPrimary : theme.colors.textMuted} />
                </View>
                <Text style={[styles.badgeTitle, { color: done ? theme.colors.textPrimary : theme.colors.textSecondary }]}>{item.title}</Text>
                <Text style={[styles.badgeCaption, { color: theme.colors.textMuted }]}>{item.caption}</Text>
                <Text style={[styles.badgeProgress, { color: done ? theme.colors.textPrimary : theme.colors.textMuted }]}>
                  {done ? "Unlocked" : `${percent}%`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const achievementGroups = useMemo(() => {
    const completionMilestones = [1, 10, 20, 50, 100, 300].map((target) => ({
      id: `complete-${target}`,
      title: `${target} Completions`,
      caption: target === 1 ? "Complete your first habit log" : `Reach ${target} total completions`,
      current: summary.totalCompletions,
      target,
      icon: "checkmark-done-outline",
    }));

    const streakMilestones = [3, 7, 14, 30, 60, 120].map((target) => ({
      id: `streak-${target}`,
      title: `${target} Day Streak`,
      caption: `Build a ${target}-day streak`,
      current: summary.bestStreak,
      target,
      icon: "flame-outline",
    }));

    const consistencyMilestones = [50, 70, 85, 95].map((target) => ({
      id: `consistency-${target}`,
      title: `${target}% Consistency`,
      caption: `Keep overall completion at ${target}%`,
      current: summary.totalCompletionRate,
      target,
      icon: "pie-chart-outline",
    }));

    return [
      { id: "completions", title: "Completion Milestones ✅", data: completionMilestones },
      { id: "streak", title: "Streak Milestones 🔥", data: streakMilestones },
      { id: "consistency", title: "Consistency Milestones 🎯", data: consistencyMilestones },
    ];
  }, [summary]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerArea}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Habits ✨</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Track and manage your lifetime growth library.
          </Text>
          <View style={styles.topTabRow}>
            {TOP_TABS.map((tab) => (
              <Pressable
                key={tab}
                onPress={async () => {
                  await selectionHaptic();
                  setActiveTab(tab);
                }}
                style={styles.topTabPress}
              >
                <Text style={[styles.topTabText, { color: activeTab === tab ? theme.colors.textPrimary : theme.colors.textMuted }]}>
                  {tab}
                </Text>
                <View style={[styles.topTabUnderline, { backgroundColor: activeTab === tab ? theme.colors.textPrimary : "transparent" }]} />
              </Pressable>
            ))}
          </View>
        </View>

        <FlatList
          data={activeTab === "My Habits" ? filteredHabits : []}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { backgroundColor: theme.colors.background }]}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1, backgroundColor: theme.colors.background }}
          ListHeaderComponent={
            activeTab === "My Habits" ? (
              <View>
                <View style={styles.statsBar}>
                  <View style={[styles.statItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.statNum, { color: theme.colors.textPrimary }]}>{summary.totalHabits}</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>TOTAL</Text>
                  </View>
                  <View style={[styles.statItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.statNum, { color: theme.colors.textPrimary }]}>{summary.completedToday}</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>DONE</Text>
                  </View>
                  <View style={[styles.statItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.statNum, { color: theme.colors.textPrimary }]}>{summary.pendingToday}</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>PENDING</Text>
                  </View>
                </View>

                <View style={[styles.searchBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Ionicons name="search" size={18} color={theme.colors.textMuted} />
                  <TextInput
                    placeholder="Search habits..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={query}
                    onChangeText={setQuery}
                    style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                  />
                  {query.length > 0 && (
                    <Pressable onPress={() => setQuery("")}>
                      <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
                    </Pressable>
                  )}
                </View>

                <View style={styles.filtersArea}>
                  <Text style={[styles.filterTitle, { color: theme.colors.textMuted }]}>STATUS</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {STATUS_FILTERS.map(f => (
                      <Chip key={f} label={f} active={statusFilter === f} onPress={() => setStatusFilter(f)} theme={theme} />
                    ))}
                  </ScrollView>

                  <Text style={[styles.filterTitle, { color: theme.colors.textMuted }]}>FREQUENCY</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {FREQ_FILTERS.map(f => (
                      <Chip key={f} label={f} active={freqFilter === f} onPress={() => setFreqFilter(f)} theme={theme} />
                    ))}
                  </ScrollView>

                  <Text style={[styles.filterTitle, { color: theme.colors.textMuted }]}>SORT BY</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {SORT_OPTIONS.map(f => (
                      <Chip key={f} label={f} active={sortBy === f} onPress={() => setSortBy(f)} theme={theme} />
                    ))}
                  </ScrollView>
                </View>
              </View>
            ) : (
              <View style={styles.achievementsScroll}>{achievementGroups.map(renderAchievementSection)}</View>
            )
          }
          renderItem={({ item }) => (
            <HabitDetailCard
              habit={item}
              onToggle={handleToggle}
              onOpenDetail={(id) => navigation.navigate("HabitDetail", { habitId: id })}
            />
          )}
          ListEmptyComponent={activeTab === "My Habits" ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={50} color={theme.colors.border} />
              <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>No habits match these filters.</Text>
            </View>
          ) : null}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerArea: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 14,
  },
  topTabRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  topTabPress: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 6,
  },
  topTabText: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  topTabUnderline: {
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    width: "70%",
  },
  statsBar: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
  },
  statNum: {
    fontSize: 20,
    fontWeight: "900",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  searchBox: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
  filtersArea: {
    gap: 12,
  },
  filterTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  filterRow: {
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "800",
  },
  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
  },
  achievementsScroll: {
    gap: 14,
    marginTop: 2,
  },
  achieveCard: {
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 16,
  },
  achieveHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  achieveTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  achieveCount: {
    fontSize: 12,
    fontWeight: "800",
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  badgeItem: {
    width: "48.5%",
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 10,
    minHeight: 116,
  },
  badgeIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3,
  },
  badgeCaption: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 15,
  },
  badgeProgress: {
    marginTop: "auto",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
});
