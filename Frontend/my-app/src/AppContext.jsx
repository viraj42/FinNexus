import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Context ────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Provider ───────────────────────────────────────────────────────────────
export function AppProvider({ children }) {

  // ── Role (persisted in localStorage so it survives refresh) ──────────────
  const [role, setRoleState] = useState(
    () => localStorage.getItem("appRole") || "admin"
  );

  const setRole = (newRole) => {
    localStorage.setItem("appRole", newRole);
    setRoleState(newRole);
  };

  // ── Dark Mode (persisted in localStorage) ────────────────────────────────
  const [darkMode, setDarkModeState] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    setDarkModeState((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", String(next));
      return next;
    });
  };

  // ── Apply / remove "dark" class on <html> element ────────────────────────
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ── Derived helper: is the current user an admin? ─────────────────────────
  const isAdmin = role === "admin";

  return (
    <AppContext.Provider value={{ role, setRole, isAdmin, darkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}