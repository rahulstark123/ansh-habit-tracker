import { useMemo, useState } from "react";
import { 
  Alert, 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Switch, 
  Text, 
  View, 
  Platform, 
  Linking,
  Modal,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeSelectorSheet from "../components/ThemeSelectorSheet";
import { useHabits } from "../context/HabitContext";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme";
import { getHabitSummary } from "../utils/metrics";
import { selectionHaptic } from "../utils/haptics";

const { width, height } = Dimensions.get("window");

const MASTERY_SCHEDULE = [
  { level: "Rookie 🌱", min: 0, max: 6, color: "#94a3b8", icon: "leaf-outline" },
  { level: "Apprentice 🛠️", min: 7, max: 14, color: "#06b6d4", icon: "construct-outline" },
  { level: "Novice 🚀", min: 15, max: 29, color: "#10b981", icon: "rocket-outline" },
  { level: "Journeyman ⚔️", min: 30, max: 59, color: "#8b5cf6", icon: "shield-outline" },
  { level: "Master 🏆", min: 60, max: 89, color: "#f59e0b", icon: "trophy-outline" },
  { level: "Elite 💎", min: 90, max: 119, color: "#ec4899", icon: "diamond-outline" },
  { level: "Legend 👑", min: 120, max: 999, color: "#6366f1", icon: "ribbon-outline" },
];

function Section({ title, children, theme }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {children}
      </View>
    </View>
  );
}

function Divider({ theme }) {
  return <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />;
}

function SettingRow({ icon, label, value, onPress, theme, showChevron = true, danger = false }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Ionicons name={icon} size={15} color={danger ? "#E53935" : theme.colors.textPrimary} />
        </View>
        <Text style={[styles.rowLabel, { color: danger ? "#E53935" : theme.colors.textPrimary }]}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value ? <Text style={[styles.rowValue, { color: theme.colors.textMuted }]}>{value}</Text> : null}
        {showChevron ? <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} /> : null}
      </View>
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const theme = useAppTheme();
  const { habits } = useHabits();
  const { signOut, user } = useAuth();
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const [showMasteryModal, setShowMasteryModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const summary = useMemo(() => getHabitSummary(habits), [habits]);
  const themeLabel =
    theme.mode === "system" ? "System" : theme.mode === "dark" ? "Dark" : "Light";

  const joinDate = useMemo(() => {
    if (!user?.createdAt) return "Unknown";
    const date = new Date(user.createdAt);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [user]);

  const mastery = useMemo(() => {
    const streak = summary.bestStreak;
    const current = MASTERY_SCHEDULE.find((m, i) => {
      const next = MASTERY_SCHEDULE[i + 1];
      return streak >= m.min && (!next || streak < next.min);
    }) || MASTERY_SCHEDULE[0];

    const nextLevel = MASTERY_SCHEDULE[MASTERY_SCHEDULE.indexOf(current) + 1] || null;
    const progress = nextLevel ? ((streak - current.min) / (nextLevel.min - current.min)) * 100 : 100;

    return { ...current, nextLevel, progress };
  }, [summary.bestStreak]);

  const handleProfileClick = async () => {
    await selectionHaptic();
    navigation.navigate("PersonalDetails");
  };

  const showMasteryInfo = async () => {
    await selectionHaptic();
    setShowMasteryModal(true);
  };

  async function openThemeSheet() {
    await selectionHaptic();
    setShowThemeSheet(true);
  }

  async function onThemeSelect(mode) {
    await selectionHaptic();
    theme.setMode(mode);
  }

  function placeholderAction(title) {
    Alert.alert(title, "UI ready. Bridge connection coming soon! 💎");
  }

  async function openWeek() {
    await selectionHaptic();
    navigation.getParent()?.navigate("Week");
  }

  async function openMilestones() {
    await selectionHaptic();
    navigation.navigate("Milestones");
  }

  async function toggleNotifications(value) {
    await selectionHaptic();
    setNotificationsEnabled(value);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.mainTitle, { color: theme.colors.textPrimary }]}>Profile ✨</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Management & Identity</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable 
              onPress={showMasteryInfo}
              style={[styles.proBadge, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
            >
              <Ionicons name="shield-checkmark" size={14} color={mastery.color} />
              <Text style={[styles.proText, { color: theme.colors.textPrimary }]}>{mastery.level.split(" ")[0]}</Text>
            </Pressable>
            <View style={[styles.proBadge, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
              <Ionicons name="diamond" size={12} color={theme.colors.textPrimary} />
              <Text style={[styles.proText, { color: theme.colors.textPrimary }]}>PRO</Text>
            </View>
          </View>
        </View>

        <Pressable 
          onPress={handleProfileClick}
          style={({ pressed }) => [
            styles.hero, 
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border, opacity: pressed ? 0.95 : 1 }
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.avatarText, { color: theme.colors.textPrimary }]}>
              {user?.name?.charAt(0) || "U"}
            </Text>
          </View>
          <View style={styles.heroInfo}>
            <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{user?.name || "User"} 👋</Text>
            <Text style={[styles.email, { color: theme.colors.textMuted }]}>{user?.email || ""}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.miniBadge, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.miniBadgeText, { color: theme.colors.textMuted }]}>
                  {user?.goal === "build" ? "Building 🔨" : user?.goal === "consistent" ? "Consistent ♾️" : "Productive ⚡"}
                </Text>
              </View>
              <View style={[styles.miniBadge, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.miniBadgeText, { color: theme.colors.textMuted }]}>
                  Joined {joinDate} 🛡️
                </Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
        </Pressable>

        <View style={styles.quickRow}>
          <Pressable
            onPress={openWeek}
            style={[styles.quickCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <Ionicons name="stats-chart" size={16} color={theme.colors.textPrimary} />
            <Text style={[styles.quickValue, { color: theme.colors.textPrimary }]}>{summary.todayCompletionRate}%</Text>
            <Text style={[styles.quickLabel, { color: theme.colors.textMuted }]}>Daily Score 🎯</Text>
          </Pressable>

          <Pressable
            onPress={openMilestones}
            style={[styles.quickCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <Ionicons name="flame" size={16} color={theme.colors.textPrimary} />
            <Text style={[styles.quickValue, { color: theme.colors.textPrimary }]}>{summary.bestStreak}</Text>
            <Text style={[styles.quickLabel, { color: theme.colors.textMuted }]}>Best Streak 🔥</Text>
          </Pressable>
        </View>

        <Section title="Account" theme={theme}>
          <SettingRow icon="person-outline" label="Personal Details" theme={theme} onPress={handleProfileClick} />
          <Divider theme={theme} />
          <SettingRow icon="key-outline" label="Security & Password" theme={theme} onPress={() => navigation.navigate("Security")} />
          <Divider theme={theme} />
          <SettingRow icon="shield-checkmark-outline" label="Privacy Settings" theme={theme} onPress={() => placeholderAction("Privacy")} />
        </Section>

        <Section title="Preferences" theme={theme}>
          <SettingRow icon="color-palette-outline" label="App Theme" value={themeLabel} theme={theme} onPress={openThemeSheet} />
          <Divider theme={theme} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Ionicons name="notifications-outline" size={15} color={theme.colors.textPrimary} />
              </View>
              <Text style={[styles.rowLabel, { color: theme.colors.textPrimary }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.textPrimary }}
              thumbColor={theme.colors.card}
            />
          </View>
        </Section>

        <Section title="Support" theme={theme}>
          <SettingRow icon="help-circle-outline" label="Help Center" theme={theme} onPress={() => placeholderAction("Help Center")} />
          <Divider theme={theme} />
          <SettingRow icon="headset-outline" label="Contact Support" theme={theme} onPress={() => placeholderAction("Contact Support")} />
          <Divider theme={theme} />
          <SettingRow icon="chatbubble-ellipses-outline" label="Send Feedback" theme={theme} onPress={() => navigation.navigate("Feedback")} />
          <Divider theme={theme} />
          <SettingRow 
            icon="lock-closed-outline" 
            label="Privacy Policy" 
            theme={theme} 
            onPress={() => Linking.openURL("https://anshapps.in")} 
          />
          <Divider theme={theme} />
          <SettingRow 
            icon="document-text-outline" 
            label="Terms & Conditions" 
            theme={theme} 
            onPress={() => Linking.openURL("https://anshapps.in")} 
          />
        </Section>

        <Section title="Session" theme={theme}>
          <SettingRow
            icon="log-out-outline"
            label="Sign Out 👋"
            danger
            theme={theme}
            onPress={signOut}
            showChevron={false}
          />
        </Section>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
            Made with Purpose ❤️ Ansh Apps
          </Text>
        </View>
      </ScrollView>

      {/* Modern Mastery Modal */}
      <Modal
        visible={showMasteryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMasteryModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowMasteryModal(false)}
        >
          <View 
            style={[styles.masteryCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <View style={[styles.modalIconWrap, { backgroundColor: mastery.color + "20" }]}>
                <Ionicons name={mastery.icon} size={32} color={mastery.color} />
              </View>
              <Text style={[styles.modalLevelTitle, { color: theme.colors.textPrimary }]}>{mastery.level} Rank</Text>
              <Text style={[styles.modalPoints, { color: theme.colors.textMuted }]}>{summary.bestStreak} Day Mastery 🔥</Text>
            </View>

            <View style={styles.progWrap}>
              <View style={styles.progHeader}>
                <Text style={[styles.progTag, { color: theme.colors.textMuted }]}>PROGRESSION</Text>
                <Text style={[styles.progVal, { color: theme.colors.textPrimary }]}>{Math.round(mastery.progress)}%</Text>
              </View>
              <View style={[styles.progTrack, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.progBar, { backgroundColor: mastery.color, width: `${mastery.progress}%` }]} />
              </View>
              {mastery.nextLevel && (
                <Text style={[styles.nextTag, { color: theme.colors.textMuted }]}>
                  Next: {mastery.nextLevel.level.split(" ")[0]} at {mastery.nextLevel.min} days 🚀
                </Text>
              )}
            </View>

            <ScrollView style={styles.masteryList} showsVerticalScrollIndicator={false}>
              {MASTERY_SCHEDULE.map((m, i) => (
                <View key={i} style={[styles.masteryRow, summary.bestStreak >= m.min && { opacity: 1 }]}>
                  <View style={[styles.masteryDot, { backgroundColor: summary.bestStreak >= m.min ? m.color : theme.colors.border }]} />
                  <Text style={[styles.masteryName, { color: summary.bestStreak >= m.min ? theme.colors.textPrimary : theme.colors.textMuted }]}>{m.level}</Text>
                  <Text style={[styles.masteryMin, { color: theme.colors.textMuted }]}>{m.min}+ Days</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              onPress={() => setShowMasteryModal(false)}
              style={[styles.modalCloseBtn, { backgroundColor: theme.colors.textPrimary }]}
            >
              <Text style={[styles.modalCloseText, { color: theme.colors.background }]}>I'll Conquer Higher ✨</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <ThemeSelectorSheet
        visible={showThemeSheet}
        selectedMode={theme.mode}
        onSelect={onThemeSelect}
        onClose={() => setShowThemeSheet(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  hero: {
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800"
  },
  heroInfo: {
    flex: 1,
    marginLeft: 16
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2
  },
  email: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  miniBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  proBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  proText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  quickRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24
  },
  quickCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 22,
    padding: 16,
  },
  quickValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "900"
  },
  quickLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "800"
  },
  section: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    borderWidth: 1.5,
    borderRadius: 22,
    overflow: "hidden"
  },
  divider: {
    height: 1,
    marginLeft: 54
  },
  row: {
    minHeight: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "700"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  masteryCard: {
    width: "100%",
    maxHeight: "85%",
    borderRadius: 32,
    borderWidth: 2,
    padding: 24,
    overflow: "hidden",
  },
  modalHeader: {
    alignItems: "center",
    paddingBottom: 24,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  modalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalLevelTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 4,
  },
  modalPoints: {
    fontSize: 14,
    fontWeight: "600",
  },
  progWrap: {
    marginBottom: 24,
  },
  progHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progTag: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  progVal: {
    fontSize: 14,
    fontWeight: "900",
  },
  progTrack: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progBar: {
    height: "100%",
    borderRadius: 6,
  },
  nextTag: {
    fontSize: 11,
    fontWeight: "700",
  },
  masteryList: {
    marginBottom: 20,
  },
  masteryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    opacity: 0.3,
  },
  masteryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 16,
  },
  masteryName: {
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
  },
  masteryMin: {
    fontSize: 12,
    fontWeight: "700",
  },
  modalCloseBtn: {
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "900",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
    marginBottom: 20
  },
  footerText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    opacity: 0.6
  }
});
