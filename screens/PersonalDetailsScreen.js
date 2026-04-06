import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme";
import { selectionHaptic } from "../utils/haptics";

const { width } = Dimensions.get("window");

function DetailItem({ icon, label, value, theme }) {
  return (
    <View style={[styles.detailBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.card }]}>
        <Ionicons name={icon} size={20} color={theme.colors.textPrimary} />
      </View>
      <View style={styles.detailInfo}>
        <Text style={[styles.detailLabel, { color: theme.colors.textMuted }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function PersonalDetailsScreen({ navigation }) {
  const theme = useAppTheme();
  const { user } = useAuth();

  const joinDate = useMemo(() => {
    if (!user?.createdAt) return "Lifetime Member";
    const date = new Date(user.createdAt);
    return date.toLocaleDateString("en-US", { day: 'numeric', month: "long", year: "numeric" });
  }, [user]);

  const handleBack = async () => {
    await selectionHaptic();
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Identity Details ✨</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Identity Card */}
          <View style={[styles.heroCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.avatarText, { color: theme.colors.textPrimary }]}>
                {user?.name?.charAt(0) || "U"}
              </Text>
            </View>
            <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>{user?.name || "User Name"}</Text>
            <Text style={[styles.userEmail, { color: theme.colors.textMuted }]}>{user?.email || "email@example.com"}</Text>
            
            <View style={styles.identityBadges}>
              <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="shield-checkmark" size={12} color={theme.colors.textPrimary} />
                <Text style={[styles.badgeText, { color: theme.colors.textPrimary }]}>Verified Account</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>GROWTH PROFILE 🛡️</Text>
          
          <DetailItem 
            icon="compass" 
            label="Habitual Goal" 
            value={user?.goal === "build" ? "Building Habits 🔨" : user?.goal === "consistent" ? "Staying Consistent ♾️" : "Improving Productivity ⚡"} 
            theme={theme} 
          />
          
          <DetailItem 
            icon="school" 
            label="Experience Level" 
            value={user?.level || "Beginner Mastery"} 
            theme={theme} 
          />
          
          <DetailItem 
            icon="timer" 
            label="Focus Window" 
            value={user?.focusTime || "All Day Focus"} 
            theme={theme} 
          />

          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>ACCOUNT JOURNEY 📅</Text>
          
          <DetailItem 
            icon="calendar" 
            label="Member Since" 
            value={joinDate} 
            theme={theme} 
          />
          
          <DetailItem 
            icon="hardware-chip" 
            label="Account Status" 
            value="Premium Access Activated 💎" 
            theme={theme} 
          />

          <View style={styles.footerInfo}>
            <Ionicons name="lock-closed-outline" size={14} color={theme.colors.textMuted} />
            <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
              Your data is encrypted and secure with Ansh Cloud 🛡️
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
  },
  heroCard: {
    padding: 30,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "900",
  },
  userName: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  identityBadges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  detailBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 22,
    borderWidth: 1.5,
    marginBottom: 12,
    gap: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "800",
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
