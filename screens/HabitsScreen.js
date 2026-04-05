import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
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

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [freqFilter, setFreqFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Priority");

  const filteredHabits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const base = habits.filter((habit) => {
      const byQuery = normalizedQuery.length === 0 || habit.name.toLowerCase().includes(normalizedQuery);
      const byStatus =
        statusFilter === "All" ||
        (statusFilter === "Done" && habit.completedToday) ||
        (statusFilter === "Pending" && !habit.completedToday);
      const byFreq = freqFilter === "All" || habit.frequency === freqFilter;

      return byQuery && byStatus && byFreq;
    });

    const sorted = [...base];
    sorted.sort((a, b) => {
      if (sortBy === "Name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "Streak") {
        return b.streak - a.streak;
      }
      if (sortBy === "Completion") {
        const aRate = a.totalCount > 0 ? a.completedCount / a.totalCount : 0;
        const bRate = b.totalCount > 0 ? b.completedCount / b.totalCount : 0;
        return bRate - aRate;
      }

      if (a.completedToday !== b.completedToday) {
        return a.completedToday ? 1 : -1;
      }
      return b.streak - a.streak;
    });

    return sorted;
  }, [habits, query, statusFilter, freqFilter, sortBy]);

  async function handleToggle(habitId) {
    await selectionHaptic();
    toggleHabit(habitId);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.headerWrap}>
              <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>All Habits</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Search, filter and track every habit in detail.
              </Text>

              <View style={styles.statRow}>
                <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Total</Text>
                  <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{summary.totalHabits}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Done</Text>
                  <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{summary.completedToday}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Pending</Text>
                  <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{summary.pendingToday}</Text>
                </View>
              </View>

              <View style={[styles.searchWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Ionicons name="search-outline" size={16} color={theme.colors.textMuted} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search habits"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                />
                {query.length > 0 ? (
                  <Pressable onPress={() => setQuery("")}>
                    <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: theme.colors.textMuted }]}>Status</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipRow}>
                    {STATUS_FILTERS.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        active={statusFilter === option}
                        onPress={() => setStatusFilter(option)}
                        theme={theme}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: theme.colors.textMuted }]}>Frequency</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipRow}>
                    {FREQ_FILTERS.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        active={freqFilter === option}
                        onPress={() => setFreqFilter(option)}
                        theme={theme}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: theme.colors.textMuted }]}>Sort by</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipRow}>
                    {SORT_OPTIONS.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        active={sortBy === option}
                        onPress={() => setSortBy(option)}
                        theme={theme}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <HabitDetailCard
              habit={item}
              onToggle={handleToggle}
              onOpenDetail={(habitId) => navigation.navigate("HabitDetail", { habitId })}
            />
          )}
          ListEmptyComponent={
            <View style={[styles.emptyCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
              <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No habits match these filters.</Text>
            </View>
          }
        />
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
    paddingHorizontal: 24
  },
  listContent: {
    paddingBottom: 40
  },
  headerWrap: {
    marginBottom: 6
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 15,
    fontWeight: "500"
  },
  statRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700"
  },
  searchWrap: {
    borderWidth: 1,
    borderRadius: 12,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500"
  },
  filterSection: {
    marginBottom: 10
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7
  },
  chipRow: {
    flexDirection: "row",
    gap: 8
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 34,
    alignItems: "center",
    justifyContent: "center"
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700"
  },
  emptyCard: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600"
  }
});
