import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme";

export default function FloatingActionButton({ onPress, bottomOffset = 30 }) {
  const theme = useAppTheme();
  const bg = theme.isDark ? "#FFFFFF" : "#000000";
  const fg = theme.isDark ? "#000000" : "#FFFFFF";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, { bottom: bottomOffset }, pressed && styles.pressed]}
    >
      <View style={[styles.button, { backgroundColor: bg }]}>
        <Ionicons name="add" size={30} color={fg} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 24,
    bottom: 30
  },
  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center"
  },
  pressed: {
    transform: [{ scale: 0.96 }]
  }
});
