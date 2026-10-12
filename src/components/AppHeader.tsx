import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.ts";
import type { NavItem } from "../types/navigation.ts";

const navItems: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/favorites", label: "Favorites" },
];

export function AppHeader() {
  const { user, status, signOutUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const isSignedIn = status === "ready" && user !== null;

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");
    try {
      await signOutUser();
    } catch (error: unknown) {
      setLogoutError(error instanceof Error ? error.message : "Could not log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/" className="brand">
          Movie Explorer AI
        </NavLink>
        <nav aria-label="Main">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {status !== "loading" && !isSignedIn ? (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Login
                </NavLink>
              </li>
            ) : null}
            {isSignedIn ? (
              <li className="header-account">
                <span>{user.email ?? "Signed in"}</span>
                <button type="button" className="nav-button" onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? "Logging out…" : "Logout"}
                </button>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
      {logoutError ? (
        <p className="header-error" role="alert">
          {logoutError}
        </p>
      ) : null}
    </header>
  );
}
