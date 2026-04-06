import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme";
import { selectionHaptic, impactHaptic } from "../utils/haptics";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const theme = useAppTheme();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      await impactHaptic("light");
      return;
    }
    
    await impactHaptic("medium");
    setIsLoading(true);
    
    const result = await signIn(email, password);
    setIsLoading(false);
    
    if (!result.success) {
      alert(result.error || "Login failed");
    }
  };

  const togglePassword = async () => {
    await selectionHaptic();
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      
      {/* Decorative Background Elements */}
      <View style={[styles.bgCircle, { top: -100, right: -50, backgroundColor: theme.colors.textPrimary, opacity: 0.05 }]} />
      <View style={[styles.bgCircle, { bottom: -150, left: -100, width: 300, height: 300, backgroundColor: theme.colors.textPrimary, opacity: 0.03 }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
                {/* Header Section */}
                <View style={styles.header}>
                  <View style={[styles.logoContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Image 
                      source={require("../assets/habit_tracker_login.png")} 
                      style={styles.logoImage} 
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Ansh</Text>
                  <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                    Elevate your life with premium habit mastery.
                  </Text>
                </View>

                {/* Main Card */}
                <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                  <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Welcome Back</Text>
                  <Text style={[styles.cardSubtitle, { color: theme.colors.textMuted }]}>Sign in to continue your journey</Text>

                  <View style={styles.form}>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>EMAIL</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="mail-outline" size={18} color={theme.colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, { color: theme.colors.textPrimary }]}
                          placeholder="hello@ansh.app"
                          placeholderTextColor={theme.colors.textMuted}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={email}
                          onChangeText={setEmail}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>PASSWORD</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="lock-closed-outline" size={18} color={theme.colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, { color: theme.colors.textPrimary }]}
                          placeholder="••••••••"
                          placeholderTextColor={theme.colors.textMuted}
                          secureTextEntry={!showPassword}
                          value={password}
                          onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={togglePassword} activeOpacity={0.6}>
                          <Ionicons 
                            name={showPassword ? "eye-outline" : "eye-off-outline"} 
                            size={18} 
                            color={theme.colors.textMuted} 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.6}>
                      <Text style={[styles.forgotText, { color: theme.colors.textMuted }]}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleLogin}
                      activeOpacity={0.9}
                      disabled={isLoading}
                      style={[
                        styles.loginButton,
                        { 
                          backgroundColor: theme.colors.textPrimary,
                          shadowColor: theme.colors.textPrimary,
                        },
                        isLoading && { opacity: 0.8 }
                      ]}
                    >
                      <Text style={[styles.loginButtonText, { color: theme.colors.background }]}>
                        {isLoading ? "Authenticating..." : "Sign In"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Social Login */}
                <View style={styles.socialSection}>
                  <View style={styles.dividerRow}>
                    <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
                    <Text style={[styles.dividerText, { color: theme.colors.textMuted }]}>OR CONTINUE WITH</Text>
                    <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
                  </View>

                  <View style={styles.socialRow}>
                    <TouchableOpacity 
                      style={[styles.socialButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: 0.5 }]}
                      activeOpacity={1}
                      onPress={() => alert("Google Sign-In is coming soon!")}
                    >
                      <Ionicons name="logo-google" size={24} color={theme.colors.textPrimary} />
                      <Text style={[styles.socialButtonText, { color: theme.colors.textPrimary }]}>Continue with Google</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.footer}>
                  <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
                    New to Ansh?{" "}
                    <Text 
                      onPress={() => navigation.navigate("SignUp")} 
                      style={[styles.footerLink, { color: theme.colors.textPrimary }]}
                    >
                      Create Account
                    </Text>
                  </Text>
                </View>
              </Animated.View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden"
  },
  bgCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.05,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden"
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
    paddingHorizontal: 40,
  },
  card: {
    borderRadius: 32,
    borderWidth: 1,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 24,
  },
  form: {
    gap: 18,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "700",
  },
  loginButton: {
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  socialSection: {
    marginTop: 32,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerLink: {
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
