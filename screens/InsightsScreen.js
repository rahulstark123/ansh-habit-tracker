import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { getHabitPerformanceStats, getHabitSummary, getRangeStats } from "../utils/metrics";
import { selectionHaptic } from "../utils/haptics";
import PieChart from "../components/PieChart";

const { width } = Dimensions.get("window");

function AnshLineChart({ data, theme }) {
  const height = 180;
  const chartWidth = width - 48;
  const padding = 30;

  const points = useMemo(() => {
    if (!data || data.length < 2) return [];
    return data.map((d, i) => {
      const x = padding + (i * (chartWidth - padding * 2)) / (data.length - 1);
      const y = height - padding - (d.value / (d.total || 1)) * (height - padding * 2);
      return { x, y };
    });
  }, [data, chartWidth]);

  if (points.length < 2) return null;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }

  return (
    <View style={styles.chartContainer}>
      <Svg height={height} width={chartWidth}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.colors.textPrimary} stopOpacity="0.15" />
            <Stop offset="1" stopColor={theme.colors.textPrimary} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={`${d} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`} fill="url(#grad)" />
        <Path d={d} fill="none" stroke={theme.colors.textPrimary} strokeWidth="3" strokeLinecap="round" />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r="4" fill={theme.colors.background} stroke={theme.colors.textPrimary} strokeWidth="2" />
        ))}
      </Svg>
    </View>
  );
}

const RANGES = ["7D", "30D", "1Y"];

export default function InsightsScreen() {
  const theme = useAppTheme();
  const { habits } = useHabits();
  const [range, setRange] = useState("7D");
  const summary = useMemo(() => getHabitSummary(habits), [habits]);

  const stats = useMemo(() => {
    const r = range === "7D" ? "7d" : range === "30D" ? "30d" : "1y";
    return getRangeStats(habits, r);
  }, [habits, range]);
  const performance = useMemo(() => getHabitPerformanceStats(habits), [habits]);
  const todayPoint = stats.series[stats.series.length - 1];
  const todayRate = todayPoint && todayPoint.total > 0 ? Math.round((todayPoint.value / todayPoint.total) * 100) : 0;
  const bestRate = stats.bestPoint && stats.bestPoint.total > 0 ? Math.round((stats.bestPoint.value / stats.bestPoint.total) * 100) : 0;

  const handleRangeChange = async (r) => {
    await selectionHaptic();
    setRange(r);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Insights 📈</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Deep dive into your behavioral patterns.</Text>

          {/* Range Filter */}
          <View style={styles.filterContainer}>
            {RANGES.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => handleRangeChange(r)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: range === r ? theme.colors.textPrimary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[styles.filterText, { color: range === r ? theme.colors.background : theme.colors.textPrimary }]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Momentum Spectrum */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.cardTag, { color: theme.colors.textMuted }]}>MOMENTUM SPECTRUM 🌊</Text>
            <AnshLineChart data={stats.series} theme={theme} />
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>{stats.rate}%</Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>CONSISTENCY</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryVal, { color: theme.colors.textPrimary }]}>{stats.bestPoint?.label || "N/A"}</Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>PEAK DAY</Text>
              </View>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={[styles.kpiCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.kpiValue, { color: theme.colors.textPrimary }]}>{summary.totalCompletionRate}%</Text>
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>LIFETIME RATE</Text>
            </View>
            <View style={[styles.kpiCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.kpiValue, { color: theme.colors.textPrimary }]}>{summary.avgStreak}</Text>
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>AVG STREAK</Text>
            </View>
            <View style={[styles.kpiCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.kpiValue, { color: theme.colors.textPrimary }]}>
                {summary.completedToday}/{summary.totalHabits}
              </Text>
              <Text style={[styles.kpiLabel, { color: theme.colors.textMuted }]}>DONE TODAY</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.miniCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.miniHeader}>
                <Ionicons name="today-outline" size={15} color={theme.colors.textMuted} />
                <Text style={[styles.miniTitle, { color: theme.colors.textMuted }]}>TODAY</Text>
              </View>
              <PieChart percent={todayRate} />
            </View>
            <View style={[styles.miniCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.miniHeader}>
                <Ionicons name="stats-chart-outline" size={15} color={theme.colors.textMuted} />
                <Text style={[styles.miniTitle, { color: theme.colors.textMuted }]}>{range} RATE</Text>
              </View>
              <PieChart percent={stats.rate} />
            </View>
            <View style={[styles.miniCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.miniHeader}>
                <Ionicons name="trophy-outline" size={15} color={theme.colors.textMuted} />
                <Text style={[styles.miniTitle, { color: theme.colors.textMuted }]}>BEST</Text>
              </View>
              <PieChart percent={bestRate} />
            </View>
          </View>

          <View style={[styles.insightCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.insightHead}>
              <Ionicons name="trophy-outline" size={16} color="#10b981" />
              <Text style={[styles.insightTag, { color: theme.colors.textMuted }]}>TOP HABIT</Text>
            </View>
            <Text style={[styles.insightValue, { color: theme.colors.textPrimary }]}>
              {performance.topHabit ? performance.topHabit.name : "Add habits to unlock"}
            </Text>
            <Text style={[styles.insightSub, { color: theme.colors.textMuted }]}>
              {performance.topHabit ? `${performance.topHabit.rate}% completion, ${performance.topHabit.streak} day streak` : "No performance data yet"}
            </Text>
          </View>

          <View style={[styles.insightCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.insightHead}>
              <Ionicons name="warning-outline" size={16} color="#f59e0b" />
              <Text style={[styles.insightTag, { color: theme.colors.textMuted }]}>NEEDS ATTENTION</Text>
            </View>
            <Text style={[styles.insightValue, { color: theme.colors.textPrimary }]}>
              {performance.needsAttentionHabit ? performance.needsAttentionHabit.name : "Great baseline"}
            </Text>
            <Text style={[styles.insightSub, { color: theme.colors.textMuted }]}>
              {performance.needsAttentionHabit
                ? `${performance.needsAttentionHabit.rate}% completion so far. Small daily wins will raise this fastest.`
                : "Create more habits to compare performance patterns."}
            </Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
            <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
              Your velocity is maintaining a <Text style={{fontWeight: '900', color: theme.colors.textPrimary}}>{stats.rate}%</Text> trajectory. Keep the habit alive! 🛡️
            </Text>
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
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "900",
  },
  card: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  cardTag: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryVal: {
    fontSize: 22,
    fontWeight: "900",
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 30,
  },
  infoCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  miniCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: "center",
    gap: 8,
  },
  miniHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  miniTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "900",
  },
  kpiLabel: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.9,
  },
  insightCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  insightHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  insightTag: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  insightSub: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
});
