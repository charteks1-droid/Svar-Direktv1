import Constants from "expo-constants";

const expoExtra = Constants.expoConfig?.extra ?? {};

const repDomain = process.env.EXPO_PUBLIC_DOMAIN as string | undefined;

export const APP_CONFIG = {
  apiBaseUrl: (process.env.EXPO_PUBLIC_API_URL as string | undefined)
    ?? (expoExtra.apiBaseUrl as string | undefined)
    ?? (repDomain ? `https://${repDomain}/api` : ""),

  appVersion: Constants.expoConfig?.version ?? "1.0.0",

  isProduction: process.env.NODE_ENV === "production",
} as const;
