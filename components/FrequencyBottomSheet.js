import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme";

const OPTIONS = ["Daily", "Weekly"];

export default function FrequencyBottomSheet({ visible, selected, onSelect, onClose }) {
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
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(slide, {
        toValue: 320,
        duration: 150,
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
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Frequency</Text>
          {OPTIONS.map((option) => {
            const active = selected === option;
            return (
              <Pressable
                key={option}
                onPress={() => {
                  onSelect(option);
                  closeSheet();
                }}
                style={[
                  styles.option,
                  {
                    backgroundColor: active ? theme.colors.surface : theme.colors.card,
                    borderColor: theme.colors.border
                  }
                ]}
              >
                <View style={styles.optionRow}>
                  <Ionicons
                    name={option === "Daily" ? "sunny-outline" : "calendar-number-outline"}
                    size={15}
                    color={theme.colors.textPrimary}
                  />
                  <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>{option}</Text>
                </View>
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
    paddingTop: 18,
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8
  },
  option: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600"
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  }
});
