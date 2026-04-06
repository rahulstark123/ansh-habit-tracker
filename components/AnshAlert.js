import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, Animated, View, Dimensions, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme";

const { width } = Dimensions.get("window");

export default function AnshAlert({ visible, message, type = "error", onClose }) {
  const theme = useAppTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Auto hide after 3 seconds
        setTimeout(() => {
          hideAlert();
        }, 3000);
      });
    }
  }, [visible]);

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  if (!visible && opacityAnim === 0) return null;

  const iconName = type === "error" ? "alert-circle" : "checkmark-circle";
  const iconColor = type === "error" ? "#EF4444" : "#10B981";

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.card,
          borderColor: type === "error" ? "#EF4444" + "40" : "#10B981" + "40",
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.content}>
        <Ionicons name={iconName} size={20} color={iconColor} />
        <Text style={[styles.message, { color: theme.colors.textPrimary }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 20,
    left: 20,
    right: 20,
    zIndex: 9999,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      }
    })
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  message: {
    fontSize: 14,
    fontWeight: "700",
  }
});
