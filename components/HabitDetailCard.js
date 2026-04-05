import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme";

export default function HabitDetailCard({ habit, onOpenDetail, onToggle }) {
  const theme = useAppTheme();
  const completionRate = Math.round((habit.completedCount / habit.totalCount) * 100);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{habit.name}</Text>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: habit.completedToday ? theme.colors.textPrimary : theme.colors.surface,
              borderColor: habit.completedToday ? theme.colors.textPrimary : theme.colors.border
            }
          ]}
        >
          <Text style={[styles.statusText, { color: habit.completedToday ? theme.colors.background : theme.colors.textSecondary }]}>
            {habit.completedToday ? "Done" : "Pending"}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="repeat-outline" size={13} color={theme.colors.textMuted} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>{habit.frequency}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="flame-outline" size={13} color={theme.colors.textMuted} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>{habit.streak} days</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="checkmark-done-outline" size={13} color={theme.colors.textMuted} />
          <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
            {habit.completedCount}/{habit.totalCount}
          </Text>
        </View>
      </View>

      <View style={styles.progressWrap}>
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.progressFill, { width: `${completionRate}%`, backgroundColor: theme.colors.textPrimary }]} />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textMuted }]}>{completionRate}% completion</Text>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          onPress={() => onOpenDetail(habit.id)}
          style={[styles.secondaryBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.secondaryText, { color: theme.colors.textPrimary }]}>Details</Text>
        </Pressable>

        <Pressable
          onPress={() => onToggle(habit.id)}
          style={[styles.primaryBtn, { backgroundColor: theme.colors.textPrimary }]}
        >
          <Text style={[styles.primaryText, { color: theme.colors.background }]}>
            {habit.completedToday ? "Undo" : "Complete"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 12
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    paddingRight: 10
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 999,
    minWidth: 72,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700"
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600"
  },
  progressWrap: {
    marginBottom: 12
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999
  },
  progressText: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "600"
  },
  actionRow: {
    flexDirection: "row",
    gap: 8
  },
  secondaryBtn: {
    flex: 1,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryBtn: {
    flex: 1,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: "700"
  },
  primaryText: {
    fontSize: 13,
    fontWeight: "700"
  }
});
