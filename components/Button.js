import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../theme";

export default function Button({ title, onPress, disabled = false, style }) {
  const theme = useAppTheme();
  const backgroundColor = theme.isDark ? "#FFFFFF" : "#000000";
  const textColor = theme.isDark ? "#000000" : "#FFFFFF";

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [style, pressed && styles.pressed]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: disabled ? theme.colors.textMuted : backgroundColor
          }
        ]}
      >
        <Text style={[styles.title, { color: disabled ? theme.colors.card : textColor }]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }]
  }
});
