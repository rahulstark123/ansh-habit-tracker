import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme";
import { selectionHaptic, impactHaptic } from "../utils/haptics";
import { FOCUS_TIME_OPTIONS, GOAL_OPTIONS, LEVEL_OPTIONS } from "../utils/profileOptions";

const { width, height } = Dimensions.get("window");

const GOAL_WITH_META = [
  { id: "build", icon: "hammer-outline" },
  { id: "consistent", icon: "infinite-outline" },
  { id: "productivity", icon: "flash-outline" },
];

const LEVEL_WITH_META = [
  { id: "beginner", sub: "I'm just starting out", icon: "leaf-outline" },
  { id: "intermediate", sub: "I have some habits", icon: "leaf-outline" },
  { id: "master", sub: "I want to optimize", icon: "trophy-outline" },
];

const TIME_WITH_META = [
  { id: "morning", icon: "sunny-outline" },
  { id: "afternoon", icon: "partly-sunny-outline" },
  { id: "evening", icon: "moon-outline" },
  { id: "all", icon: "time-outline" },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("build");
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [selectedTime, setSelectedTime] = useState("morning");
  const [reminders, setReminders] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { completeOnboarding, user } = useAuth();
  const theme = useAppTheme();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(step / 6)).current;

  useEffect(() => {
    runAnimation();
  }, [step]);

  const runAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: step / 6,
        duration: 400,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handleNext = async () => {
    await selectionHaptic();
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = async () => {
    if (step > 1) {
      await selectionHaptic();
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    await impactHaptic("heavy");
    const result = await completeOnboarding(selectedGoal, reminders, selectedLevel, selectedTime);
    if (!result.success) {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Ionicons name="sparkles" size={40} color={theme.colors.textPrimary} />
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Welcome to Ansh ✨</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              Build better habits. One day at a time.
            </Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Ionicons name="person-outline" size={40} color={theme.colors.textPrimary} />
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Let’s get to know you 👋</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              Everything in Ansh is personalized for you, {user?.name || "there"}.
            </Text>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: theme.colors.textPrimary, textAlign: "left", alignSelf: "flex-start" }]}>
              What do you want to achieve? 🎯
            </Text>
            <View style={styles.optionsGrid}>
              {GOAL_WITH_META.map((goalMeta) => {
                const goal = GOAL_OPTIONS.find((g) => g.id === goalMeta.id);
                if (!goal) return null;
                return (
                <TouchableOpacity
                  key={goalMeta.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedGoal(goalMeta.id)}
                  style={[
                    styles.goalOption,
                    { 
                      backgroundColor: selectedGoal === goalMeta.id ? theme.colors.textPrimary : theme.colors.surface,
                      borderColor: selectedGoal === goalMeta.id ? theme.colors.textPrimary : theme.colors.border
                    }
                  ]}
                >
                  <Ionicons 
                    name={goalMeta.icon} 
                    size={24} 
                    color={selectedGoal === goalMeta.id ? theme.colors.background : theme.colors.textPrimary} 
                  />
                  <Text style={[
                    styles.goalLabel, 
                    { color: selectedGoal === goalMeta.id ? theme.colors.background : theme.colors.textPrimary }
                  ]}>
                    {goal.label}
                  </Text>
                </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: theme.colors.textPrimary, textAlign: "left", alignSelf: "flex-start" }]}>
              How experienced are you?
            </Text>
            <View style={styles.optionsGrid}>
              {LEVEL_WITH_META.map((itemMeta) => {
                const item = LEVEL_OPTIONS.find((l) => l.id === itemMeta.id);
                if (!item) return null;
                return (
                <TouchableOpacity
                  key={itemMeta.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedLevel(itemMeta.id)}
                  style={[
                    styles.levelOption,
                    { 
                      backgroundColor: selectedLevel === itemMeta.id ? theme.colors.textPrimary : theme.colors.surface,
                      borderColor: selectedLevel === itemMeta.id ? theme.colors.textPrimary : theme.colors.border
                    }
                  ]}
                >
                  <View style={[styles.iconWrap, { backgroundColor: selectedLevel === itemMeta.id ? theme.colors.background + "20" : theme.colors.background }]}>
                    <Ionicons 
                      name={itemMeta.icon} 
                      size={20} 
                      color={selectedLevel === itemMeta.id ? theme.colors.background : theme.colors.textPrimary} 
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.goalLabel, { color: selectedLevel === itemMeta.id ? theme.colors.background : theme.colors.textPrimary }]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.goalSub, { color: selectedLevel === itemMeta.id ? theme.colors.background + "80" : theme.colors.textMuted }]}>
                      {itemMeta.sub}
                    </Text>
                  </View>
                </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.title, { color: theme.colors.textPrimary, textAlign: "left", alignSelf: "flex-start" }]}>
              When is your focus time?
            </Text>
            <View style={styles.timeGrid}>
              {TIME_WITH_META.map((itemMeta) => {
                const item = FOCUS_TIME_OPTIONS.find((t) => t.id === itemMeta.id);
                if (!item) return null;
                return (
                <TouchableOpacity
                  key={itemMeta.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTime(itemMeta.id)}
                  style={[
                    styles.timeOption,
                    { 
                      backgroundColor: selectedTime === itemMeta.id ? theme.colors.textPrimary : theme.colors.surface,
                      borderColor: selectedTime === itemMeta.id ? theme.colors.textPrimary : theme.colors.border
                    }
                  ]}
                >
                  <Ionicons 
                    name={itemMeta.icon} 
                    size={28} 
                    color={selectedTime === itemMeta.id ? theme.colors.background : theme.colors.textPrimary} 
                  />
                  <Text style={[styles.timeLabel, { color: selectedTime === itemMeta.id ? theme.colors.background : theme.colors.textPrimary }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContainer}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Ionicons name="notifications-outline" size={40} color={theme.colors.textPrimary} />
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Stay on track.</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              Small reminders. Big impact.
            </Text>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setReminders(!reminders)}
              style={[
                styles.reminderToggle,
                { 
                  backgroundColor: reminders ? theme.colors.textPrimary + "10" : theme.colors.surface,
                  borderColor: reminders ? theme.colors.textPrimary : theme.colors.border
                }
              ]}
            >
              <View style={styles.reminderInfo}>
                <Text style={[styles.reminderTitle, { color: theme.colors.textPrimary }]}>Enable Notifications</Text>
                <Text style={[styles.reminderSub, { color: theme.colors.textMuted }]}>Receive daily nudges to stay consistent</Text>
              </View>
              <View style={[styles.checkbox, { borderColor: theme.colors.textPrimary, backgroundColor: reminders ? theme.colors.textPrimary : "transparent" }]}>
                {reminders && <Ionicons name="checkmark" size={14} color={theme.colors.background} />}
              </View>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {step > 1 ? (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 44 }} />
            )}
            <View style={[styles.stepBadge, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.stepText, { color: theme.colors.textMuted }]}>Step {step} of 6</Text>
            </View>
            <View style={{ width: 44 }} />
          </View>
          <View style={[styles.progressBg, { backgroundColor: theme.colors.surface }]}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { 
                  backgroundColor: theme.colors.textPrimary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"]
                  })
                }
              ]} 
            />
          </View>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {renderStep()}
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.9}
            disabled={isSubmitting}
            style={[
              styles.button,
              { 
                backgroundColor: theme.colors.textPrimary,
                shadowColor: theme.colors.textPrimary,
              }
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.colors.background }]}>
              {isSubmitting ? "Finalizing..." : step === 6 ? "Complete Setup" : "Continue"}
            </Text>
            {!isSubmitting && <Ionicons name="arrow-forward" size={18} color={theme.colors.background} style={{ marginLeft: 8 }} />}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "700",
  },
  progressBg: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  progressBar: {
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  stepContainer: {
    alignItems: "center",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
    paddingHorizontal: 20,
  },
  optionsGrid: {
    width: "100%",
    gap: 12,
    marginTop: 20,
  },
  goalOption: {
    height: 64,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  levelOption: {
    height: 80,
    borderRadius: 20,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: "800",
  },
  goalSub: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },
  timeOption: {
    width: (width - 60) / 2,
    height: 120,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  timeLabel: {
    fontSize: 15,
    fontWeight: "800",
  },
  reminderToggle: {
    marginTop: 40,
    width: "100%",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reminderInfo: {
    flex: 1,
    paddingRight: 20,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  reminderSub: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 10 : 24,
  },
  button: {
    height: 64,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
