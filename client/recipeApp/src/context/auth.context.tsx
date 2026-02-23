import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "../types/auth.types";
import { authApi } from "../data-access/auth.api";

type AuthState = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
  (async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      setLoading(false);
      return;
    }

    try {
      if (token) {
        try {
          const me = await authApi.me();
          setUser(me);
          return;
        } catch (e: any) {
          console.log("ME FAILED, TRY REFRESH:", e?.response?.status);
        }
      }

      const fresh = await authApi.refresh();

      const access = (fresh as any).token;
      const newRefresh = (fresh as any).refreshToken;

      if (!access || !newRefresh) throw new Error("Refresh response missing tokens");

      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", newRefresh);

      const me = await authApi.me();
      setUser(me);
    } catch (e: any) {
      console.log("AUTH INIT FAILED:", e?.response?.status, e?.response?.data, e);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  })();
}, []);



  const value = useMemo(() => ({ user, setUser, logout, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
