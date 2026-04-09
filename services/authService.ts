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
  if (!base) throw new Error("API-URL saknas. Kontakta support.");

  const url = `${base}${path}`;
  console.log("[API] POST", url);

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkErr: unknown) {
    const msg = networkErr instanceof Error ? networkErr.message : String(networkErr);
    console.error("[API] Network error:", msg, "URL:", url);
    throw new Error(`Nätverksfel – kunde inte nå servern.\n(${url})`);
  }

  const text = await resp.text();
  console.log("[API] Status", resp.status, "Body:", text.slice(0, 300));

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("[API] Non-JSON response from", url, ":", text.slice(0, 200));
    throw new Error(
      `Servern svarade med HTML (${resp.status}).\nURL: ${url}\nSvar: ${text.slice(0, 80)}`
    );
  }

  if (!resp.ok) {
    throw new Error((data as { error?: string })?.error ?? `Serverfel ${resp.status}`);
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
