import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ApiError,
  PublicUser,
  authApi,
  getToken,
  setToken,
  subscriptionApi,
} from "@/services/api";

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  initializing: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const loadMe = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const { user: u } = await authApi.me();
      setUser(u);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        await setToken(null);
        setUser(null);
      } else {
        console.warn("loadMe failed:", e);
      }
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadMe();
      setInitializing(false);
    })();
  }, [loadMe]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, user: u } = await authApi.login(email, password);
      await setToken(token);
      setUser(u);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, user: u } = await authApi.register(email, password);
      await setToken(token);
      setUser(u);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    await loadMe();
  }, [loadMe]);

  const refreshSubscription = useCallback(async () => {
    try {
      const { user: u } = await subscriptionApi.refresh();
      setUser(u);
    } catch (e) {
      console.warn("refreshSubscription failed:", e);
      await loadMe();
    }
  }, [loadMe]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      initializing,
      isAuthenticated: !!user,
      isPremium: !!user?.isPremium,
      login,
      register,
      logout,
      refresh,
      refreshSubscription,
    }),
    [user, loading, initializing, login, register, logout, refresh, refreshSubscription]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
