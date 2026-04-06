import React, { useMemo } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { getRangeStats } from "../utils/metrics";

const { width } = Dimensions.get("window");

function DayRing({ day, theme }) {
  const progress = day.total > 0 ? Math.round((day.value / day.total) * 100) : 0;
  const size = 44;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.dayCol}>
      <View style={styles.ringInner}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.surface}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.textPrimary}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <Text style={[styles.ringDayVal, { color: theme.colors.textPrimary }]}>{progress}%</Text>
      </View>
      <Text style={[styles.dayName, { color: theme.colors.textMuted }]}>{day.label}</Text>
    </View>
  );
}

export default function WeekScreen() {
  const theme = useAppTheme();
  const { habits } = useHabits();
  
  // Use the new getRangeStats engine specifically for 7 days
  const weekly = useMemo(() => getRangeStats(habits, "7d"), [habits]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Weekly Focus 🔬</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Analysis of your 7-day habit cycle.</Text>

          {/* 1. Mastery Horizon Strip */}
          <View style={[styles.heroCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.cardTag, { color: theme.colors.textMuted }]}>7-DAY MOMENTUM 🚀</Text>
            <View style={styles.horizon}>
              {weekly.series.map((day, i) => (
                <DayRing key={i} day={day} theme={theme} />
              ))}
            </View>
          </View>

          {/* 2. Analysis Deck */}
          <View style={styles.deck}>
            <View style={[styles.deckHalf, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.deckHeader}>
                <Ionicons name="trending-up" size={16} color="#10b981" />
                <Text style={[styles.deckTag, { color: "#10b981" }]}>PEAKS</Text>
              </View>
              <Text style={[styles.deckValue, { color: theme.colors.textPrimary }]}>{weekly.bestPoint?.label || "N/A"}</Text>
              <Text style={[styles.deckSubtitle, { color: theme.colors.textMuted }]}>Was your high momentum point 🔥</Text>
            </View>
            
            <View style={[styles.deckHalf, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.deckHeader}>
                <Ionicons name="flash" size={16} color="#f59e0b" />
                <Text style={[styles.deckTag, { color: "#f59e0b" }]}>CONSISTENCY</Text>
              </View>
              <Text style={[styles.deckValue, { color: theme.colors.textPrimary }]}>{weekly.rate}%</Text>
              <Text style={[styles.deckSubtitle, { color: theme.colors.textMuted }]}>Weekly completion rate 🎯</Text>
            </View>
          </View>

          {/* 3. Detailed Day Log */}
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>DETAILED LOG 📅</Text>
          <View style={styles.logList}>
            {weekly.series.map((day, i) => (
              <View key={i} style={[styles.logRow, { borderBottomColor: theme.colors.border }]}>
                <View style={styles.logLeft}>
                  <Text style={[styles.logDay, { color: theme.colors.textPrimary }]}>{day.label}</Text>
                  <Text style={[styles.logDate, { color: theme.colors.textMuted }]}>Performance Point</Text>
                </View>
                <View style={styles.logRight}>
                  <View style={[styles.logIndicator, { backgroundColor: day.value > 0 ? theme.colors.textPrimary + "15" : theme.colors.surface }]}>
                    <Text style={[styles.logScore, { color: day.value > 0 ? theme.colors.textPrimary : theme.colors.textMuted }]}>
                      {day.value} / {day.total}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 32,
  },
  heroCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  cardTag: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  horizon: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCol: {
    alignItems: "center",
  },
  ringInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringDayVal: {
    position: "absolute",
    fontSize: 9,
    fontWeight: "900",
  },
  dayName: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    marginTop: 10,
  },
  deck: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  deckHalf: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  deckHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  deckTag: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  deckValue: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 4,
  },
  deckSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 20,
    marginLeft: 4,
  },
  logList: {
    marginBottom: 40,
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  logDay: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  logDate: {
    fontSize: 11,
    fontWeight: "600",
  },
  logIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  logScore: {
    fontSize: 13,
    fontWeight: "900",
  },
});
