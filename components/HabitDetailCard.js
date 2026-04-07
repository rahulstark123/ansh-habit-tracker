import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme";

export default function HabitDetailCard({ habit, onOpenDetail, onToggle }) {
  const theme = useAppTheme();
  
  const title = habit.title || habit.name || "Untitled Habit";
  const icon = habit.icon || "star-outline";
  const color = habit.color || theme.colors.textPrimary;
  const isCompleted = habit.completedToday;
  
  const completionRate = habit.totalCount > 0 
    ? Math.round((habit.completedCount / habit.totalCount) * 100) 
    : 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.freq, { color: theme.colors.textMuted }]}>{habit.frequency.toUpperCase()}</Text>
        </View>
        <View style={[styles.streakBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Ionicons name="flame" size={12} color="#ff4d4d" />
          <Text style={[styles.streakText, { color: theme.colors.textPrimary }]}>{habit.streak}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressLabel, { color: theme.colors.textMuted }]}>OVERALL PROGRESS</Text>
          <Text style={[styles.progressValue, { color: color }]}>{completionRate}%</Text>
        </View>
        <View style={[styles.track, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.fill, { width: `${completionRate}%`, backgroundColor: color }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.statGroup}>
          <Text style={[styles.statNum, { color: theme.colors.textPrimary }]}>{habit.completedCount}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>DONE</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statGroup}>
          <Text style={[styles.statNum, { color: theme.colors.textPrimary }]}>{habit.totalCount}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>TOTAL</Text>
        </View>
        
        <View style={styles.actions}>
          <Pressable 
            onPress={() => onOpenDetail(habit.id)}
            style={[styles.actionBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.textPrimary} />
          </Pressable>
          <Pressable 
            onPress={() => onToggle(habit.id, !isCompleted)}
            style={[styles.mainAction, { backgroundColor: isCompleted ? theme.colors.surface : theme.colors.textPrimary }]}
          >
            <Text style={[styles.mainActionText, { color: isCompleted ? theme.colors.textPrimary : theme.colors.background }]}>
              {isCompleted ? "Completed" : "Complete"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  freq: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: "800",
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "900",
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statGroup: {
    alignItems: "center",
    marginRight: 16,
  },
  statNum: {
    fontSize: 14,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#eee",
    marginRight: 16,
    opacity: 0.5,
  },
  actions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  mainAction: {
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mainActionText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
