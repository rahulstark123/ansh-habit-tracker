import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeSelectorSheet from "../components/ThemeSelectorSheet";
import { useHabits } from "../context/HabitContext";
import { useAppTheme } from "../theme";
import { getHabitSummary } from "../utils/metrics";
import { selectionHaptic } from "../utils/haptics";

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
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const summary = useMemo(() => getHabitSummary(habits), [habits]);
  const themeLabel =
    theme.mode === "system" ? "System" : theme.mode === "dark" ? "Dark" : "Light";

  async function openThemeSheet() {
    await selectionHaptic();
    setShowThemeSheet(true);
  }

  async function onThemeSelect(mode) {
    await selectionHaptic();
    theme.setMode(mode);
  }

  function placeholderAction(title) {
    Alert.alert(title, "UI ready. Backend connection can be added next.");
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
        <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>Profile</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Premium control center for your habits.</Text>

        <View style={[styles.hero, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.avatarText, { color: theme.colors.textPrimary }]}>A</Text>
          </View>
          <View style={styles.heroInfo}>
            <Text style={[styles.name, { color: theme.colors.textPrimary }]}>Ansh</Text>
            <Text style={[styles.email, { color: theme.colors.textMuted }]}>ansh@habitflow.app</Text>
          </View>
          <View style={[styles.proBadge, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <Ionicons name="diamond-outline" size={12} color={theme.colors.textPrimary} />
            <Text style={[styles.proText, { color: theme.colors.textPrimary }]}>Pro</Text>
          </View>
        </View>

        <View style={styles.quickRow}>
          <Pressable
            onPress={openWeek}
            style={[styles.quickCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <Ionicons name="calendar-outline" size={16} color={theme.colors.textPrimary} />
            <Text style={[styles.quickValue, { color: theme.colors.textPrimary }]}>{summary.todayCompletionRate}%</Text>
            <Text style={[styles.quickLabel, { color: theme.colors.textMuted }]}>Today Score</Text>
          </Pressable>

          <Pressable
            onPress={openMilestones}
            style={[styles.quickCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <Ionicons name="flame-outline" size={16} color={theme.colors.textPrimary} />
            <Text style={[styles.quickValue, { color: theme.colors.textPrimary }]}>{summary.bestStreak}</Text>
            <Text style={[styles.quickLabel, { color: theme.colors.textMuted }]}>Best Streak</Text>
          </Pressable>
        </View>

        <Section title="Account" theme={theme}>
          <SettingRow icon="person-circle-outline" label="Edit Profile" theme={theme} onPress={() => placeholderAction("Edit Profile")} />
          <Divider theme={theme} />
          <SettingRow icon="key-outline" label="Change Password" theme={theme} onPress={() => placeholderAction("Change Password")} />
          <Divider theme={theme} />
          <SettingRow icon="shield-checkmark-outline" label="Two-Factor Authentication" theme={theme} onPress={() => placeholderAction("2FA Settings")} />
          <Divider theme={theme} />
          <SettingRow icon="phone-portrait-outline" label="Connected Devices" theme={theme} onPress={() => placeholderAction("Connected Devices")} />
          <Divider theme={theme} />
          <SettingRow icon="log-out-outline" label="Log Out All Devices" theme={theme} onPress={() => placeholderAction("Log Out All Devices")} />
        </Section>

        <Section title="Preferences" theme={theme}>
          <SettingRow icon="color-palette-outline" label="Theme" value={themeLabel} theme={theme} onPress={openThemeSheet} />
          <Divider theme={theme} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Ionicons name="notifications-outline" size={15} color={theme.colors.textPrimary} />
              </View>
              <Text style={[styles.rowLabel, { color: theme.colors.textPrimary }]}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.textPrimary }}
              thumbColor={theme.colors.card}
            />
          </View>
          <Divider theme={theme} />
          <SettingRow icon="language-outline" label="Language" value="English" theme={theme} onPress={() => placeholderAction("Language")} />
        </Section>

        <Section title="Support" theme={theme}>
          <SettingRow icon="help-circle-outline" label="Help Center" theme={theme} onPress={() => placeholderAction("Help Center")} />
          <Divider theme={theme} />
          <SettingRow icon="headset-outline" label="Contact Support" theme={theme} onPress={() => placeholderAction("Contact Support")} />
          <Divider theme={theme} />
          <SettingRow icon="chatbubble-ellipses-outline" label="Send Feedback" theme={theme} onPress={() => placeholderAction("Send Feedback")} />
        </Section>

        <Section title="Privacy & Legal" theme={theme}>
          <SettingRow icon="lock-closed-outline" label="Privacy Policy" theme={theme} onPress={() => placeholderAction("Privacy Policy")} />
          <Divider theme={theme} />
          <SettingRow icon="document-text-outline" label="Terms of Service" theme={theme} onPress={() => placeholderAction("Terms of Service")} />
          <Divider theme={theme} />
          <SettingRow icon="download-outline" label="Export My Data" theme={theme} onPress={() => placeholderAction("Data Export")} />
        </Section>

        <Section title="Session" theme={theme}>
          <SettingRow
            icon="log-out-outline"
            label="Sign Out"
            danger
            theme={theme}
            onPress={() => placeholderAction("Sign Out")}
            showChevron={false}
          />
        </Section>
      </ScrollView>

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
    paddingTop: 8,
    paddingBottom: 40
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 15,
    fontWeight: "500"
  },
  hero: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700"
  },
  heroInfo: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2
  },
  email: {
    fontSize: 13,
    fontWeight: "500"
  },
  proBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  proText: {
    fontSize: 12,
    fontWeight: "700"
  },
  quickRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16
  },
  quickCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  quickValue: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "700"
  },
  quickLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600"
  },
  section: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 8
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden"
  },
  divider: {
    height: 1,
    marginLeft: 50
  },
  row: {
    minHeight: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "600"
  }
});
