import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.ts";

type AuthMode = "login" | "signup";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }
    if (password.length === 0) {
      setErrorMessage("Enter your password.");
      return;
    }
    if (isSignup && password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      if (isSignup) await signUp(trimmedEmail, password);
      else await signIn(trimmedEmail, password);
      navigate("/", { replace: true });
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-mode" role="group" aria-label="Authentication mode">
        <button
          type="button"
          className={mode === "login" ? "auth-mode-button active" : "auth-mode-button"}
          aria-pressed={mode === "login"}
          onClick={() => switchMode("login")}
          disabled={isSubmitting}
        >
          Log in
        </button>
        <button
          type="button"
          className={mode === "signup" ? "auth-mode-button active" : "auth-mode-button"}
          aria-pressed={mode === "signup"}
          onClick={() => switchMode("signup")}
          disabled={isSubmitting}
        >
          Sign up
        </button>
      </div>

      <label htmlFor="auth-email">Email</label>
      <input
        id="auth-email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? "auth-error" : undefined}
        required
      />

      <label htmlFor="auth-password">Password</label>
      <input
        id="auth-password"
        name="password"
        type="password"
        autoComplete={isSignup ? "new-password" : "current-password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? "auth-error" : "auth-password-hint"}
        required
      />
      <p id="auth-password-hint" className="auth-hint">
        {isSignup ? "Use at least 6 characters." : "Enter the password for your account."}
      </p>

      {errorMessage ? (
        <p id="auth-error" className="status-panel status-panel-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Please wait…" : isSignup ? "Create account" : "Log in"}
      </button>
    </form>
  );
}
