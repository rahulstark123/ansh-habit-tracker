import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme";
import { selectionHaptic, successHaptic } from "../utils/haptics";

const { width } = Dimensions.get("window");

const FEEDBACK_TYPES = ["Bug 🐛", "Feature ✨", "Opinion 💬", "Other 🛡️"];
const RATING_EMOJIS = ["😡", "🙁", "😐", "😊", "💎"];

export default function FeedbackScreen({ navigation }) {
  const theme = useAppTheme();
  const [selectedType, setSelectedType] = useState("Opinion 💬");
  const [rating, setRating] = useState(4); // Default to 😊
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(async () => {
      await successHaptic();
      setIsSubmitting(false);
      alert("Feedback received! Thank you for building Ansh with us. 💎✨");
      navigation.goBack();
    }, 1200);
  };

  const handleBack = async () => {
    await selectionHaptic();
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>Feedback 🔥</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>How can we evolve? 🚀</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Your insight helps us build the ultimate tracker.</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>SENTIMENT 🛡️</Text>
            <View style={styles.ratingRow}>
              {RATING_EMOJIS.map((emoji, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { selectionHaptic(); setRating(i + 1); }}
                  style={[
                    styles.emojiBtn,
                    { 
                      backgroundColor: rating === i + 1 ? theme.colors.textPrimary : theme.colors.surface,
                      borderColor: rating === i + 1 ? theme.colors.textPrimary : theme.colors.border
                    }
                  ]}
                >
                  <Text style={[styles.emoji, { opacity: rating === i + 1 ? 1 : 0.6 }]}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>FOCUS AREA 🎯</Text>
            <View style={styles.typeGrid}>
              {FEEDBACK_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => { selectionHaptic(); setSelectedType(type); }}
                  style={[
                    styles.typePill,
                    { 
                      backgroundColor: selectedType === type ? theme.colors.textPrimary : theme.colors.surface,
                      borderColor: selectedType === type ? theme.colors.textPrimary : theme.colors.border
                    }
                  ]}
                >
                  <Text style={[styles.typeText, { color: selectedType === type ? theme.colors.background : theme.colors.textPrimary }]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>DETAILS 📑</Text>
            <View style={[styles.inputBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.textPrimary }]}
                placeholder="What's your master idea? 💎"
                placeholderTextColor={theme.colors.textMuted}
                multiline
                numberOfLines={6}
                value={message}
                onChangeText={setMessage}
              />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!message.trim() || isSubmitting}
            onPress={handleSend}
            style={[
              styles.sendBtn, 
              { backgroundColor: theme.colors.textPrimary, opacity: !message.trim() ? 0.5 : 1 }
            ]}
          >
            <Text style={[styles.sendBtnText, { color: theme.colors.background }]}>
              {isSubmitting ? "Syncing..." : "Submit Insight 🔥"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Ionicons name="heart" size={14} color="#ff4d4d" />
            <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
              Every piece of feedback makes Ansh 1% better.
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
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emojiBtn: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 24,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  typePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  typeText: {
    fontSize: 13,
    fontWeight: "800",
  },
  inputBox: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 16,
    minHeight: 160,
  },
  input: {
    fontSize: 16,
    fontWeight: "600",
    textAlignVertical: "top",
  },
  sendBtn: {
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  sendBtnText: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    gap: 8,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
