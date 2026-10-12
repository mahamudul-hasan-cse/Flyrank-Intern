import { Link } from "react-router-dom";

import { AuthForm } from "../components/AuthForm.tsx";
import { useAuth } from "../hooks/useAuth.ts";

export function LoginPage() {
  const { user, status } = useAuth();

  return (
    <section className="page">
      <h1>{status === "ready" && user ? "Account" : "Login"}</h1>

      {status === "loading" ? (
        <p className="status-panel" aria-live="polite" aria-busy="true">
          Checking your session…
        </p>
      ) : null}

      {status === "unconfigured" ? (
        <p className="status-panel status-panel-error" role="alert">
          Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local and restart the
          dev server.
        </p>
      ) : null}

      {status === "ready" && user ? (
        <p>
          You are signed in{user.email ? ` as ${user.email}` : ""}.{" "}
          <Link to="/">Go to the movie search</Link>
        </p>
      ) : null}

      {status === "ready" && !user ? (
        <>
          <p>Log in or create an account with your email and password.</p>
          <AuthForm />
        </>
      ) : null}
    </section>
  );
}
