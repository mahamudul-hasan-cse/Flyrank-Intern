import { createContext } from "react";

import type { AuthStatus, AuthUser } from "../types/auth.ts";

export type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
