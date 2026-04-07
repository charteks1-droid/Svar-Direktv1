import AsyncStorage from "@react-native-async-storage/async-storage";

import { APP_CONFIG } from "@/constants/config";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

async function apiPost<T>(path: string, body: object): Promise<T> {
  const base = APP_CONFIG.apiBaseUrl;
  if (!base) throw new Error("API inte konfigurerat.");
  const resp = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error ?? "Okänt fel.");
  }
  return data as T;
}

export async function register(email: string, password: string): Promise<AuthResult> {
  return apiPost<AuthResult>("/auth/register", { email, password });
}

export async function login(email: string, password: string): Promise<AuthResult> {
  return apiPost<AuthResult>("/auth/login", { email, password });
}

export async function storeAuth(result: AuthResult): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, result.token],
    [USER_KEY, JSON.stringify(result.user)],
  ]);
}

export async function getStoredToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function clearAuth(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
