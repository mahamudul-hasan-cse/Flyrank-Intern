import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.ts";

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <section className="page">
        <p className="status-panel" aria-live="polite" aria-busy="true">
          Checking your session…
        </p>
      </section>
    );
  }

  if (status === "unconfigured") {
    return (
      <section className="page">
        <h1>Favorites</h1>
        <p className="status-panel status-panel-error" role="alert">
          Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local and restart the
          dev server.
        </p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return children;
}
