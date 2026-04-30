import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE = "https://antiquewhite-lapwing-486017.hostingersite.com";
export const TOKEN_KEY = "@svar_direkt_auth_token";
const DEVICE_ID_KEY = "@svar_direkt_device_id";

export interface PublicUser {
  id: string;
  email: string;
  createdAt: number;
  isOwner: boolean;
  isPremium: boolean;
  subscriptionStatus: string;
  trialEndsAt: number | null;
  currentPeriodEnd: number | null;
  stripeCustomerId: string | null;
  freeLettersRemaining: number | null;
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getDeviceId(): Promise<string> {
  try {
    let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateUUID();
      await AsyncStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return generateUUID();
  }
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string | null): Promise<void> {
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (options.auth !== false) {
    const token = await getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }
  if (!res.ok) {
    throw new ApiError(
      data?.error || `HTTP ${res.status}`,
      res.status,
      data?.code
    );
  }
  return data as T;
}

export const authApi = {
  register: async (email: string, password: string) => {
    const deviceId = await getDeviceId();
    return request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, deviceId }),
      auth: false,
    });
  },
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    }),
  me: () => request<{ user: PublicUser }>("/api/auth/me"),
  changePassword: (oldPassword: string, newPassword: string) =>
    request<{ ok: boolean }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
  deleteAccount: () =>
    request<{ ok: boolean }>("/api/auth/account", { method: "DELETE" }),
};

export const subscriptionApi = {
  checkout: (successUrl?: string, cancelUrl?: string) =>
    request<{ url: string; sessionId: string }>("/api/subscription/checkout", {
      method: "POST",
      body: JSON.stringify({ successUrl, cancelUrl }),
    }),
  portal: (returnUrl?: string) =>
    request<{ url: string }>("/api/subscription/portal", {
      method: "POST",
      body: JSON.stringify({ returnUrl }),
    }),
  cancel: () =>
    request<{ user: PublicUser }>("/api/subscription/cancel", {
      method: "POST",
    }),
  refresh: () =>
    request<{ user: PublicUser }>("/api/subscription/refresh", {
      method: "POST",
    }),
};

function decodeTokenUserId(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || decoded.id || null;
  } catch {
    return null;
  }
}

export async function askAi(message: string): Promise<{ reply: string; remaining: number }> {
  const token = await getToken();
  const userId = token ? decodeTokenUserId(token) : null;
  return request<{ reply: string; remaining: number }>("/api/ai/ask", {
    method: "POST",
    body: JSON.stringify({ message, userId }),
  });
}
