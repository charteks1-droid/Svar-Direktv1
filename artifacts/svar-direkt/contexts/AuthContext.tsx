import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import {
  AuthUser,
  clearAuth,
  getStoredToken,
  getStoredUser,
  login as apiLogin,
  register as apiRegister,
  storeAuth,
} from "@/services/authService";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    async function hydrate() {
      try {
        const [token, user] = await Promise.all([getStoredToken(), getStoredUser()]);
        if (token && user) {
          setState({ user, token, loading: false });
        } else {
          setState({ user: null, token: null, loading: false });
        }
      } catch {
        setState({ user: null, token: null, loading: false });
      }
    }
    hydrate();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    await storeAuth(result);
    setState({ user: result.user, token: result.token, loading: false });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const result = await apiRegister(email, password);
    await storeAuth(result);
    setState({ user: result.user, token: result.token, loading: false });
  }, []);

  const logout = useCallback(async () => {
    await clearAuth();
    setState({ user: null, token: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        isAuthenticated: !!state.token && !!state.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
