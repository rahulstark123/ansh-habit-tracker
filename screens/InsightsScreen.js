import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useHabits } from "../context/HabitContext";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme";
import { getHabitSummary, getWeeklyStats } from "../utils/metrics";

const { width } = Dimensions.get("window");

// --- Custom Premium Charting Components ---

const AnshLineChart = ({ data, color, theme }) => {
  const chartHeight = 120;
  const chartWidth = width - 88; // Accounting for card padding
  const paddingX = 20;
  const paddingY = 20;

  if (!data || data.length < 2) return null;

  // Transform data to points with safety check
  const points = data.map((item, index) => {
    const val = Number(item.value) || 0;
    const tot = Math.max(1, Number(item.total) || 1);
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (data.length - 1);
    const y = chartHeight - paddingY - (val / tot) * (chartHeight - paddingY * 2);
    
    // Final safety against NaN
    return { x: Number.isNaN(x) ? 0 : x, y: Number.isNaN(y) ? chartHeight - paddingY : y };
  });

  // Create smooth bezier path
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    d += ` C ${cpX} ${p0.y} ${cpX} ${p1.y} ${p1.x} ${p1.y}`;
  }

  return (
    <View style={styles.chartBox}>
      <Svg height={chartHeight} width={chartWidth}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.4" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {/* Shadow/Fill Area */}
        <Path 
          d={`${d} L ${points[points.length-1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`} 
          fill="url(#grad)" 
        />
        {/* The Silk Line */}
        <Path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {/* Data Points */}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r="3" fill={theme.colors.background} stroke={color} strokeWidth="2" />
        ))}
      </Svg>
      <View style={styles.chartLabels}>
        {data.map((item, i) => (
          <Text key={i} style={[styles.chartDay, { color: theme.colors.textMuted }]}>{item.label}</Text>
        ))}
      </View>
    </View>
  );
};

const AnshRingChart = ({ progress, size = 120, color, theme }) => {
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <View style={{ width: size, height:size, alignItems: 'center', justifyContent: 'center' }}>
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
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={[styles.ringPercent, { color: theme.colors.textPrimary }]}>{progress}%</Text>
        <Text style={[styles.ringSub, { color: theme.colors.textMuted }]}>DONE</Text>
      </View>
    </View>
  );
};

// --- Main Insights Screen ---

export default function InsightsScreen({ navigation }) {
  const theme = useAppTheme();
  const { habits } = useHabits();
  
  const summary = useMemo(() => getHabitSummary(habits), [habits]);
  const weekly = useMemo(() => getWeeklyStats(habits), [habits]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Insights 📈</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Analyze your consistency over time.</Text>

          {/* 1. Daily Progress Ring Card */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTag, { color: theme.colors.textMuted }]}>DAILY MASTER 🎯</Text>
              <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Today's Success</Text>
            </View>
            <View style={styles.ringRow}>
              <AnshRingChart progress={summary.todayCompletionRate} color={theme.colors.textPrimary} theme={theme} />
              <View style={styles.ringStats}>
                <View style={styles.ringStatItem}>
                  <Text style={[styles.ringStatVal, { color: theme.colors.textPrimary }]}>{summary.completedToday}</Text>
                  <Text style={[styles.ringStatLab, { color: theme.colors.textMuted }]}>COMPLETED</Text>
                </View>
                <View style={styles.ringStatItem}>
                  <Text style={[styles.ringStatVal, { color: theme.colors.textPrimary }]}>{summary.pendingToday}</Text>
                  <Text style={[styles.ringStatLab, { color: theme.colors.textMuted }]}>REMAINING</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 2. Weekly Trend Graph Card */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTag, { color: theme.colors.textMuted }]}>WEEKLY FLOW 🌊</Text>
              <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Consistency Trend</Text>
            </View>
            <AnshLineChart data={weekly.weekly} color={theme.colors.textPrimary} theme={theme} />
            <Text style={[styles.chartCaption, { color: theme.colors.textMuted }]}>
              Highest completion on <Text style={{fontWeight: '900'}}>{weekly.bestDay.label}</Text> 🔥
            </Text>
          </View>

          {/* 3. Global Stats Grid */}
          <View style={styles.grid}>
            <View style={[styles.gridHalf, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Ionicons name="flame" size={24} color="#ff4d4d" style={{marginBottom: 10}} />
              <Text style={[styles.gridVal, { color: theme.colors.textPrimary }]}>{summary.bestStreak}</Text>
              <Text style={[styles.gridLab, { color: theme.colors.textMuted }]}>BEST STREAK</Text>
            </View>
            <View style={[styles.gridHalf, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Ionicons name="sparkles" size={24} color="#f59e0b" style={{marginBottom: 10}} />
              <Text style={[styles.gridVal, { color: theme.colors.textPrimary }]}>{summary.totalCompletionRate}%</Text>
              <Text style={[styles.gridLab, { color: theme.colors.textMuted }]}>TOTAL SCORE</Text>
            </View>
            <View style={[styles.gridHalf, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Ionicons name="infinite" size={24} color="#8b5cf6" style={{marginBottom: 10}} />
              <Text style={[styles.gridVal, { color: theme.colors.textPrimary }]}>{summary.avgStreak}</Text>
              <Text style={[styles.gridLab, { color: theme.colors.textMuted }]}>AVG STREAK</Text>
            </View>
            <View style={[styles.gridHalf, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Ionicons name="checkmark-done" size={24} color="#10b981" style={{marginBottom: 10}} />
              <Text style={[styles.gridVal, { color: theme.colors.textPrimary }]}>{summary.totalCompletions}</Text>
              <Text style={[styles.gridLab, { color: theme.colors.textMuted }]}>TOTAL CHECK-INS</Text>
            </View>
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
    marginBottom: 24,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTag: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  ringRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringPercent: {
    fontSize: 24,
    fontWeight: '900',
  },
  ringSub: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  ringStats: {
    flex: 1,
    marginLeft: 30,
    gap: 16,
  },
  ringStatItem: {
    gap: 2,
  },
  ringStatVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  ringStatLab: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  chartBox: {
    marginTop: 10,
    alignItems: 'center',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 5,
  },
  chartDay: {
    fontSize: 10,
    fontWeight: '800',
  },
  chartCaption: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  gridHalf: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  gridVal: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  gridLab: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
