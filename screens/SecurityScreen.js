import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../theme";
import { useAuth } from "../context/AuthContext";
import { selectionHaptic } from "../utils/haptics";

export default function SecurityScreen({ navigation }) {
  const theme = useAppTheme();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    await selectionHaptic();
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields 🛡️");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match ❌");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long ⚡");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Security credentials updated! 🔥");
      navigation.goBack();
    }, 1500);
  };

  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let strength = 0;
    if (newPassword.length >= 8) strength += 0.3;
    if (/[A-Z]/.test(newPassword)) strength += 0.2;
    if (/[0-9]/.test(newPassword)) strength += 0.2;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 0.3;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthColor = strength < 0.4 ? "#ef4444" : strength < 0.8 ? "#f59e0b" : "#10b981";

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Security 🔐</Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color={theme.colors.textMuted} />
                <View style={styles.infoText}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textMuted }]}>ACCOUNT EMAIL</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>{user?.email}</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>UPDATE PASSWORD</Text>

            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>CURRENT PASSWORD</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                  placeholder="Enter current password"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>NEW PASSWORD</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                  placeholder="Minimum 8 characters"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <View style={styles.strengthTrack}>
                  <View style={[styles.strengthFill, { width: `${strength * 100}%`, backgroundColor: strengthColor }]} />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>CONFIRM NEW PASSWORD</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                  placeholder="Repeat new password"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            <View style={[styles.tipsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={[styles.tipText, { color: theme.colors.textMuted }]}>Use at least 8 characters</Text>
              </View>
              <View style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={[styles.tipText, { color: theme.colors.textMuted }]}>Include a symbol (@, #, $)</Text>
              </View>
              <View style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={[styles.tipText, { color: theme.colors.textMuted }]}>Avoid using personal information</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.colors.textPrimary }]}
              onPress={handleUpdatePassword}
              disabled={loading}
            >
              <Text style={[styles.saveButtonText, { color: theme.colors.background }]}>
                {loading ? "Protecting Account..." : "Update Credentials"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteLink}>
              <Text style={styles.deleteText}>Need to delete account? Contact Support 🛡️</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  infoCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 20,
    marginLeft: 4,
  },
  inputSection: {
    gap: 20,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  strengthTrack: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  tipsCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 10,
    marginBottom: 32,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  saveButton: {
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "900",
  },
  deleteLink: {
    alignItems: "center",
    marginBottom: 40,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
});
