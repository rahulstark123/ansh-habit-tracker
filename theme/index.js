import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { useAppearance } from "../context/AppearanceContext";
import { palette, radius, spacing, typography } from "./tokens";

export function useAppTheme() {
  const { mode, setMode, resolvedScheme } = useAppearance();
  const isDark = resolvedScheme === "dark";
  const colors = isDark ? palette.dark : palette.light;

  return {
    isDark,
    mode,
    setMode,
    colors,
    spacing,
    radius,
    typography,
    shadow: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 20,
      elevation: isDark ? 2 : 4
    }
  };
}

export function getNavigationTheme(isDark, colors) {
  const baseTheme = isDark ? NavigationDarkTheme : NavigationDefaultTheme;
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.card,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.accent
    }
  };
}
