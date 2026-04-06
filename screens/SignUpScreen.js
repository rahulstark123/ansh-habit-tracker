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
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../theme";
import { selectionHaptic, impactHaptic } from "../utils/haptics";
import AnshAlert from "../components/AnshAlert";

const { width, height } = Dimensions.get("window");

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "", type: "error" });

  const { signUp } = useAuth();
  const theme = useAppTheme();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      await impactHaptic("medium");
      setAlert({ visible: true, message: "Please fill all fields to continue.", type: "error" });
      return;
    }
    
    if (password !== confirmPassword) {
      await impactHaptic("medium");
      setAlert({ visible: true, message: "Passwords do not match.", type: "error" });
      return;
    }

    await impactHaptic("medium");
    setIsLoading(true);
    
    const result = await signUp(name, email, password);
    setIsLoading(false);
    
    if (result.success) {
      setAlert({ visible: true, message: "Welcome to Ansh! Your account is ready. ✨", type: "success" });
    } else {
      setAlert({ visible: true, message: result.error || "Sign-up failed.", type: "error" });
    }
  };

  const togglePassword = async () => {
    await selectionHaptic();
    setShowPassword(!showPassword);
  };

  const goBack = async () => {
    await selectionHaptic();
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      
      <AnshAlert 
        visible={alert.visible} 
        message={alert.message} 
        type={alert.type} 
        onClose={() => setAlert({ ...alert, visible: false })} 
      />
      
      {/* Decorative Background Elements */}
      <View style={[styles.bgCircle, { top: -80, left: -40, backgroundColor: "#6366f1", opacity: 0.05 }]} />
      <View style={[styles.bgCircle, { bottom: -100, right: -60, width: 280, height: 280, backgroundColor: "#a855f7", opacity: 0.04 }]} />

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
                
                {/* Back Button */}
                <TouchableOpacity onPress={goBack} style={styles.backButton} activeOpacity={0.7}>
                  <View style={[styles.backIconWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Ionicons name="chevron-back" size={20} color={theme.colors.textPrimary} />
                  </View>
                </TouchableOpacity>

                {/* Header Section */}
                <View style={styles.header}>
                  <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Create Account</Text>
                  <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                    Start your transformation with Ansh.
                  </Text>
                </View>

                {/* Main Card */}
                <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                  <View style={styles.form}>
                    
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>FULL NAME</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="person-outline" size={18} color={theme.colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, { color: theme.colors.textPrimary }]}
                          placeholder="Ansh Jain"
                          placeholderTextColor={theme.colors.textMuted}
                          autoCapitalize="words"
                          value={name}
                          onChangeText={setName}
                        />
                      </View>
                    </View>

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

                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.colors.textMuted }]}>CONFIRM PASSWORD</Text>
                      <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.textMuted} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, { color: theme.colors.textPrimary }]}
                          placeholder="••••••••"
                          placeholderTextColor={theme.colors.textMuted}
                          secureTextEntry={!showPassword}
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handleSignUp}
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
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Terms */}
                <Text style={[styles.termsText, { color: theme.colors.textMuted }]}>
                  By signing up, you agree to our{" "}
                  <Text style={[styles.termsLink, { color: theme.colors.textPrimary }]}>Terms of Service</Text> and{" "}
                  <Text style={[styles.termsLink, { color: theme.colors.textPrimary }]}>Privacy Policy</Text>.
                </Text>

                <View style={styles.footer}>
                  <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
                    Already have an account?{" "}
                    <Text onPress={goBack} style={[styles.footerLink, { color: theme.colors.textPrimary }]}>Sign In</Text>
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
    paddingTop: height * 0.02,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 16,
    width: 44,
  },
  backIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 24,
    paddingLeft: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  card: {
    borderRadius: 30,
    borderWidth: 1,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 3,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  loginButton: {
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  termsText: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
    fontWeight: "500",
  },
  termsLink: {
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
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
