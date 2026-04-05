import { StyleSheet, TextInput, View } from "react-native";
import { useAppTheme } from "../theme";

export default function Input({ value, onChangeText, placeholder }) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={[styles.input, { color: theme.colors.textPrimary }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  input: {
    fontSize: 16,
    fontWeight: "500"
  }
});
