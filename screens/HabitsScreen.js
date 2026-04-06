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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View style={styles.headerArea}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>All Habits ✨</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                Track and manage your lifetime growth library.
              </Text>

              {/* Stats Bar */}
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

              {/* Search Bar */}
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

              {/* Filters Scrollers */}
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
          }
          renderItem={({ item }) => (
            <HabitDetailCard
              habit={item}
              onToggle={handleToggle}
              onOpenDetail={(id) => navigation.navigate("HabitDetail", { habitId: id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={50} color={theme.colors.border} />
              <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>No habits match these filters.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerArea: {
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
    marginBottom: 24,
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
});
