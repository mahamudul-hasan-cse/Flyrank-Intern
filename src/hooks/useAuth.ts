import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "../context/auth-context.ts";

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return value;
}
