import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

const STORAGE_KEY = "theme_override";

interface ThemeContextValue {
  isDark: boolean;
  theme: typeof Colors.light;
  toggleDark: () => void;
  isManual: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  theme: Colors.light,
  toggleDark: () => {},
  isManual: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === "dark" || val === "light") setOverride(val);
    });
  }, []);

  const isDark = override !== null ? override === "dark" : systemScheme === "dark";

  const toggleDark = useCallback(() => {
    const next = isDark ? "light" : "dark";
    setOverride(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{
      isDark,
      theme: isDark ? Colors.dark : Colors.light,
      toggleDark,
      isManual: override !== null,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
