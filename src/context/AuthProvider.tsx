import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  loginWithEmail,
  logout,
  registerWithEmail,
  watchAuthState,
} from "../services/authService.ts";
import { isFirebaseConfigured } from "../services/firebase.ts";
import type { AuthUser } from "../types/auth.ts";
import { AuthContext, type AuthContextValue } from "./auth-context.ts";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthSession = {
  user: AuthUser | null;
  ready: boolean;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const configured = isFirebaseConfigured();
  const [session, setSession] = useState<AuthSession>({ user: null, ready: false });

  useEffect(() => {
    if (!configured) return;
    return watchAuthState((user) => {
      setSession({ user, ready: true });
    });
  }, [configured]);

  const value = useMemo<AuthContextValue>(() => {
    const status = !configured ? "unconfigured" : session.ready ? "ready" : "loading";
    return {
      user: configured && session.ready ? session.user : null,
      status,
      signIn: loginWithEmail,
      signUp: registerWithEmail,
      signOutUser: logout,
    };
  }, [configured, session]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
