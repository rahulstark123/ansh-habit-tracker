import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PieChart from "./PieChart";
import { useAppTheme } from "../theme";

function InsightCard({ title, value, caption, width, icon, chartPercent, index, total }) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          width,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border
        }
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <Ionicons name={icon || "analytics-outline"} size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.title, { color: theme.colors.textSecondary }]}>{title}</Text>
        </View>
        <PieChart percent={chartPercent} />
      </View>

      <Text style={[styles.value, { color: theme.colors.textPrimary }]}>{value}</Text>
      <View style={styles.bottomRow}>
        <Text style={[styles.caption, { color: theme.colors.textMuted }]}>{caption}</Text>
        {total > 1 ? (
          <Text style={[styles.slideHint, { color: theme.colors.textMuted }]}>
            {index + 1}/{total}
            {index < total - 1 ? " Swipe →" : ""}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default function InsightCarousel({ cards, cardWidth }) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      decelerationRate="normal"
      contentContainerStyle={styles.row}
    >
      {cards.map((card, index) => (
        <InsightCard
          key={`${card.title}-${card.caption}`}
          index={index}
          total={cards.length}
          title={card.title}
          value={card.value}
          caption={card.caption}
          icon={card.icon}
          chartPercent={card.chartPercent}
          width={cardWidth}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingBottom: 16
  },
  card: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 0
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.4,
    marginBottom: 8
  },
  caption: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    paddingRight: 8
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  slideHint: {
    fontSize: 11,
    fontWeight: "700"
  }
});
