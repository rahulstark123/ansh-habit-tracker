import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme";

export default function HabitCard({ habit, onToggle, onOpenDetail }) {
  const theme = useAppTheme();
  
  // Support both backend 'title' and frontend-fallback 'name'
  const title = habit.title || habit.name || "Untitled Habit";
  const icon = habit.icon || "star-outline";
  const color = habit.color || theme.colors.textPrimary;
  const isCompleted = habit.completedToday;
  
  const completedAnim = useRef(new Animated.Value(isCompleted ? 1 : 0)).current;
  const toggleScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(completedAnim, {
      toValue: isCompleted ? 1 : 0,
      duration: 250,
      useNativeDriver: false
    }).start();
  }, [isCompleted]);

  function handleToggle() {
    Animated.sequence([
      Animated.timing(toggleScaleAnim, {
        toValue: 1.15,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.spring(toggleScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8
      })
    ]).start();
    onToggle(habit.id, !isCompleted);
  }

  const cardBg = completedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.card, theme.colors.surface]
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: isCompleted ? color + "40" : theme.colors.border,
          borderWidth: 1.5,
        }
      ]}
    >
      <View style={styles.mainContent}>
        <Pressable onPress={handleToggle} style={styles.iconContainer}>
          <View style={[styles.iconWrap, { backgroundColor: isCompleted ? color : theme.colors.surface }]}>
            <Ionicons 
              name={icon} 
              size={22} 
              color={isCompleted ? theme.colors.background : color} 
            />
          </View>
        </Pressable>

        <Pressable onPress={() => onOpenDetail(habit.id)} style={styles.infoArea}>
          <Text style={[
            styles.name, 
            { color: theme.colors.textPrimary, textDecorationLine: isCompleted ? "line-through" : "none", opacity: isCompleted ? 0.6 : 1 }
          ]}>
            {title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>
              {habit.frequency.toUpperCase()}
            </Text>
            {habit.targetValue > 1 && (
              <>
                <View style={[styles.dot, { backgroundColor: theme.colors.textMuted }]} />
                <Text style={[styles.metaText, { color: color }]}>
                  Goal: {habit.targetValue} {habit.targetUnit}
                </Text>
              </>
            )}
          </View>
        </Pressable>

        <Animated.View style={{ transform: [{ scale: toggleScaleAnim }] }}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={handleToggle}
            style={[
              styles.checkbox, 
              { 
                borderColor: isCompleted ? color : theme.colors.border,
                backgroundColor: isCompleted ? color : "transparent"
              }
            ]}
          >
            {isCompleted && <Ionicons name="checkmark" size={16} color={theme.colors.background} />}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

// Re-defining TouchableOpacity as Pressable for safety in this file
const TouchableOpacity = Pressable;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 24,
    marginBottom: 12,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  infoArea: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.5,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
