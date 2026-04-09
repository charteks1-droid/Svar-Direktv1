import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/contexts/AppContext";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Tillbaka" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="reminders"
        options={{ title: "Påminnelser", headerBackTitle: "Tillbaka" }}
      />
      <Stack.Screen
        name="custom-templates"
        options={{ title: "Mina mallar", headerBackTitle: "Tillbaka" }}
      />
      <Stack.Screen
        name="history"
        options={{ title: "Historik", headerBackTitle: "Tillbaka" }}
      />
      <Stack.Screen
        name="quick-responses"
        options={{ title: "Snabba svar", headerBackTitle: "Tillbaka" }}
      />
      <Stack.Screen
        name="about"
        options={{ title: "Om appen", headerBackTitle: "Tillbaka" }}
      />
      <Stack.Screen
        name="template-detail"
        options={{ title: "Mall", headerBackTitle: "Tillbaka", presentation: "modal" }}
      />
      <Stack.Screen
        name="quick-solution"
        options={{ title: "Snabb lösning", headerBackTitle: "Tillbaka" }}
      />
      <Stack.Screen
        name="forsvar"
        options={{ title: "Försvara dig", headerBackTitle: "Tillbaka" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [renderReady, setRenderReady] = useState(Platform.OS !== "web");

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const handleError = (event: ErrorEvent) => {
        if (
          event.message?.includes("timeout exceeded") ||
          event.filename?.includes("fontfaceobserver")
        ) {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
      };
      window.addEventListener("error", handleError);
      return () => window.removeEventListener("error", handleError);
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      setRenderReady(true);
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderReady(true);
      SplashScreen.hideAsync();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!renderReady) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </AppProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
