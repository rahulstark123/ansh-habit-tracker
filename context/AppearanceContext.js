import { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

const AppearanceContext = createContext(null);

export const THEME_OPTIONS = [
  { key: "system", label: "System" },
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" }
];

export function AppearanceProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState("system");

  const resolvedScheme = mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const value = useMemo(
    () => ({
      mode,
      setMode,
      resolvedScheme
    }),
    [mode, resolvedScheme]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return context;
}
