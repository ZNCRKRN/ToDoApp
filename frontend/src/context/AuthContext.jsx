import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("todo-token");
    } catch {
      return null;
    }
  });
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem("todo-username");
    } catch {
      return null;
    }
  });

  const persist = (nextToken, nextUsername) => {
    try {
      if (nextToken) {
        localStorage.setItem("todo-token", nextToken);
        localStorage.setItem("todo-username", nextUsername);
      } else {
        localStorage.removeItem("todo-token");
        localStorage.removeItem("todo-username");
      }
    } catch {
      // localStorage kullanılamıyorsa sessizce yoksay
    }
  };

  const login = async (usernameInput, password) => {
    const res = await authApi.login(usernameInput, password);
    setToken(res.token);
    setUsername(res.username);
    persist(res.token, res.username);
  };

  const register = async (usernameInput, password) => {
    const res = await authApi.register(usernameInput, password);
    setToken(res.token);
    setUsername(res.username);
    persist(res.token, res.username);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    persist(null, null);
  };

  // Backend 401 döndürdüğünde (token süresi dolmuş/geçersiz) otomatik çıkış yap.
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("todo-unauthorized", handler);
    return () => window.removeEventListener("todo-unauthorized", handler);
  }, []);

  const value = useMemo(
    () => ({ token, username, isAuthenticated: !!token, login, register, logout }),
    [token, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth, AuthProvider içinde kullanılmalı");
  }
  return ctx;
}
