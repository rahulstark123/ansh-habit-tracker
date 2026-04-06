import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FloatingActionButton from "../components/FloatingActionButton";
import HabitCard from "../components/HabitCard";
import { useHabits } from "../context/HabitContext";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme";
import { getHabitSummary } from "../utils/metrics";
import { getQuoteOfTheDay } from "../utils/dailyQuote";
import { selectionHaptic } from "../utils/haptics";

const { width } = Dimensions.get("window");

const FILTERS = ["All", "Pending", "Done"];

export default function HomeScreen({ navigation }) {
  const theme = useAppTheme();
  const { habits, toggleHabit, loading } = useHabits();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("All");

  const summary = useMemo(() => getHabitSummary(habits), [habits]);
  const dailyQuote = useMemo(() => getQuoteOfTheDay(new Date()), []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 🌅";
    if (hour < 17) return "Good Afternoon ☀️";
    return "Good Evening 🌕";
  };

  const filteredHabits = habits.filter((habit) => {
    const isDone = habit.completedToday;
    if (filter === "Pending") return !isDone;
    if (filter === "Done") return isDone;
    return true;
  });

  const groupHabits = (list) => {
    const morning = list.filter(h => h.timeOfDay === "morning");
    const afternoon = list.filter(h => h.timeOfDay === "afternoon");
    const evening = list.filter(h => h.timeOfDay === "evening");
    const others = list.filter(h => h.timeOfDay === "all" || !h.timeOfDay);
    
    return [
      { id: "morning", title: "Morning Routine 🌅", data: morning },
      { id: "afternoon", title: "Afternoon Focus ☀️", data: afternoon },
      { id: "evening", title: "Evening Ritual 🌕", data: evening },
      { id: "all", title: "All Day ✨", data: others },
    ].filter(group => group.data.length > 0);
  };

  const sections = groupHabits(filteredHabits);

  const handleToggle = async (id, completed) => {
    await selectionHaptic();
    toggleHabit(id, completed);
  };

  const renderSection = (section) => (
    <View key={section.id} style={styles.sectionWrap}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>{section.title}</Text>
      {section.data.map((item) => (
        <HabitCard
          key={item.id}
          habit={item}
          onToggle={handleToggle}
          onOpenDetail={(id) => navigation.navigate("HabitDetail", { habitId: id })}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={[1]}
          keyExtractor={() => "main"}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: 120 + insets.bottom }]}
          ListHeaderComponent={
            <View style={styles.headerArea}>
              <View style={styles.headerTop}>
                <View>
                  <Text style={[styles.greeting, { color: theme.colors.textMuted }]}>
                    {getGreeting()}, {user?.name?.split(" ")[0] || "User"} 👋
                  </Text>
                  <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Today</Text>
                </View>
                <Pressable 
                  onPress={() => navigation.navigate("Profile")}
                  style={[styles.avatar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                >
                  <Text style={[styles.avatarText, { color: theme.colors.textPrimary }]}>
                    {user?.name?.charAt(0) || "U"}
                  </Text>
                </Pressable>
              </View>

              {/* Quote Card - Reintegrated & Redesigned */}
              <View style={[styles.quoteCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.quoteIcon}>
                  <Ionicons name="sparkles" size={14} color={theme.colors.textSecondary} />
                </View>
                <Text style={[styles.quoteText, { color: theme.colors.textPrimary }]}>
                  "{dailyQuote.text}"
                </Text>
                <Text style={[styles.quoteAuthor, { color: theme.colors.textMuted }]}>
                  — {dailyQuote.author}
                </Text>
              </View>

              {/* Progress Mirror */}
              <View style={styles.progressMirror}>
                <View style={styles.progressRow}>
                  <Text style={[styles.progressLabel, { color: theme.colors.textPrimary }]}>
                    Daily Momentum <Text style={{ fontWeight: "900" }}>{summary.todayCompletionRate}%</Text> 🚀
                  </Text>
                  <Text style={[styles.progressSub, { color: theme.colors.textMuted }]}>
                    {summary.completedToday} / {summary.totalHabits}
                  </Text>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface }]}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        backgroundColor: theme.colors.textPrimary, 
                        width: `${summary.todayCompletionRate}%` 
                      }
                    ]} 
                  />
                </View>
              </View>

              {/* Stats Cards - Reintegrated */}
              <View style={styles.statsRow}>
                <Pressable 
                  onPress={() => navigation.navigate("Milestones")}
                  style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                >
                  <Ionicons name="flame" size={20} color="#ff4d4d" />
                  <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{summary.bestStreak}</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Best Streak 🔥</Text>
                </Pressable>
                <Pressable 
                  onPress={() => navigation.getParent()?.navigate("Week")}
                  style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                >
                  <Ionicons name="stats-chart" size={18} color="#4d94ff" />
                  <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{summary.todayCompletionRate}%</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Weekly Goal 🎯</Text>
                </Pressable>
              </View>

              {/* Filters */}
              <View style={styles.filterBar}>
                {FILTERS.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => { selectionHaptic(); setFilter(item); }}
                    style={[
                      styles.filterChip,
                      { 
                        backgroundColor: filter === item ? theme.colors.textPrimary : theme.colors.surface,
                        borderColor: filter === item ? theme.colors.textPrimary : theme.colors.border
                      }
                    ]}
                  >
                    <Text style={[styles.filterText, { color: filter === item ? theme.colors.background : theme.colors.textSecondary }]}>
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          }
          renderItem={() => (
            <View style={{ paddingHorizontal: 24 }}>
              {sections.length > 0 ? (
                sections.map(section => renderSection(section))
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="sparkles-outline" size={60} color={theme.colors.border} />
                  <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                    No habits here yet. Click the '+' to start! ✨
                  </Text>
                </View>
              )}
            </View>
          )}
        />

        <FloatingActionButton 
          onPress={() => navigation.navigate("AddHabit")} 
          bottomOffset={30 + insets.bottom} 
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerArea: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
  },
  quoteCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: 24,
    position: "relative",
  },
  quoteIcon: {
    position: "absolute",
    top: -10,
    right: 20,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  quoteText: {
    fontSize: 15,
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressMirror: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  progressSub: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1.5,
    gap: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "800",
  },
  listContent: {
    // Top area padding is handled in ListHeaderComponent
  },
  sectionWrap: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    paddingHorizontal: 40,
  },
});
