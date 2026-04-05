import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme";

export default function HabitCard({ habit, onToggle, onOpenDetail }) {
  const theme = useAppTheme();
  const completedAnim = useRef(new Animated.Value(habit.completedToday ? 1 : 0)).current;
  const toggleScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(completedAnim, {
      toValue: habit.completedToday ? 1 : 0,
      duration: 180,
      useNativeDriver: false
    }).start();
  }, [completedAnim, habit.completedToday]);

  function handleToggle() {
    Animated.sequence([
      Animated.timing(toggleScaleAnim, {
        toValue: 1.08,
        duration: 90,
        useNativeDriver: true
      }),
      Animated.spring(toggleScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 26,
        bounciness: 6
      })
    ]).start();
    onToggle(habit.id);
  }

  const bgColor = completedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.card, theme.colors.surface]
  });

  const textOpacity = completedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.82]
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor: theme.colors.border
        }
      ]}
    >
      <Pressable onPress={handleToggle} style={styles.topRow}>
        <Animated.View style={{ flex: 1, opacity: textOpacity }}>
          <View style={styles.nameRow}>
            <Ionicons name="ellipse-outline" size={13} color={theme.colors.textSecondary} />
            <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{habit.name}</Text>
          </View>
          <Text style={[styles.frequency, { color: theme.colors.textSecondary }]}>{habit.frequency}</Text>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: toggleScaleAnim }] }}>
          <View
            style={[
              styles.toggleOuter,
              {
                borderColor: habit.completedToday ? theme.colors.textPrimary : theme.colors.textMuted,
                backgroundColor: habit.completedToday ? theme.colors.textPrimary : "transparent"
              }
            ]}
          >
            {habit.completedToday ? <View style={[styles.toggleInner, { backgroundColor: theme.colors.card }]} /> : null}
          </View>
        </Animated.View>
      </Pressable>

      <Pressable onPress={() => onOpenDetail(habit.id)} style={styles.detailTap}>
        <Text style={[styles.detailText, { color: theme.colors.accent }]}>Details</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  frequency: {
    fontSize: 14,
    fontWeight: "500"
  },
  toggleOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  toggleInner: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  detailTap: {
    marginTop: 10
  },
  detailText: {
    fontSize: 13,
    fontWeight: "600"
  }
});
