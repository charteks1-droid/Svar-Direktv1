import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: string;
  onRightPress?: () => void;
  showBack?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  rightIcon,
  onRightPress,
  showBack = false,
}: ScreenHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topPad + 12,
          backgroundColor: theme.backgroundSecondary,
          borderBottomColor: theme.separator,
        },
      ]}
    >
      <View style={styles.row}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={8}
          >
            <Feather name="chevron-left" size={26} color={theme.tint} />
          </Pressable>
        )}
        <View style={styles.titleArea}>
          <Text
            style={[
              styles.title,
              { color: theme.text, fontFamily: "Inter_700Bold" },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary, fontFamily: "Inter_400Regular" },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {rightIcon && onRightPress && (
          <Pressable
            onPress={onRightPress}
            style={[styles.rightBtn, { backgroundColor: theme.tint }]}
            hitSlop={8}
          >
            <Feather name={rightIcon as any} size={18} color="#fff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  backBtn: {
    marginRight: 8,
    marginLeft: -4,
  },
  rightBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
