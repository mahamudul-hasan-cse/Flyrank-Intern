import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import type { AuthUser } from "../types/auth.ts";
import { getFirebaseAuth, isFirebaseConfigured } from "./firebase.ts";

function toAuthUser(user: User): AuthUser {
  return { uid: user.uid, email: user.email };
}

function authErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account already exists for this email.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email or password is incorrect.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Could not reach Firebase. Check your connection and try again.";
    default:
      return "Authentication failed. Please try again.";
  }
}

function toAuthError(error: unknown): Error {
  if (error instanceof FirebaseError) return new Error(authErrorMessage(error.code));
  if (error instanceof Error) return error;
  return new Error("Authentication failed. Please try again.");
}

export function watchAuthState(onChange: (user: AuthUser | null) => void): () => void {
  if (!isFirebaseConfigured()) {
    onChange(null);
    return () => undefined;
  }

  return onAuthStateChanged(getFirebaseAuth(), (user) => {
    onChange(user ? toAuthUser(user) : null);
  });
}

export async function registerWithEmail(email: string, password: string): Promise<void> {
  try {
    await createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  } catch (error: unknown) {
    throw toAuthError(error);
  }
}

export async function loginWithEmail(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  } catch (error: unknown) {
    throw toAuthError(error);
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(getFirebaseAuth());
  } catch (error: unknown) {
    throw toAuthError(error);
  }
}
