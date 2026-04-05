import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME_OPTIONS } from "../context/AppearanceContext";
import { useAppTheme } from "../theme";

export default function ThemeSelectorSheet({ visible, selectedMode, onSelect, onClose }) {
  const theme = useAppTheme();
  const slide = useRef(new Animated.Value(320)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 170,
        useNativeDriver: true
      }),
      Animated.spring(slide, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 5
      })
    ]).start();
  }, [fade, slide, visible]);

  function closeSheet() {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true
      }),
      Animated.timing(slide, {
        toValue: 320,
        duration: 140,
        useNativeDriver: true
      })
    ]).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });
  }

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={closeSheet}>
      <Animated.View style={[styles.overlay, { opacity: fade }]}>
        <Pressable style={styles.backdrop} onPress={closeSheet} />
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.card,
              transform: [{ translateY: slide }]
            }
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Choose Theme</Text>
          {THEME_OPTIONS.map((option) => {
            const active = option.key === selectedMode;
            return (
              <Pressable
                key={option.key}
                onPress={() => {
                  onSelect(option.key);
                  closeSheet();
                }}
                style={[
                  styles.optionRow,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: active ? theme.colors.surface : theme.colors.card
                  }
                ]}
              >
                <View style={styles.optionLeft}>
                  <Ionicons
                    name={
                      option.key === "dark"
                        ? "moon-outline"
                        : option.key === "light"
                          ? "sunny-outline"
                          : "phone-portrait-outline"
                    }
                    size={16}
                    color={theme.colors.textPrimary}
                  />
                  <Text style={[styles.optionLabel, { color: theme.colors.textPrimary }]}>{option.label}</Text>
                </View>
                {active ? <Ionicons name="checkmark-circle" size={20} color={theme.colors.textPrimary} /> : null}
              </Pressable>
            );
          })}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end"
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8
  },
  optionRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600"
  }
});
