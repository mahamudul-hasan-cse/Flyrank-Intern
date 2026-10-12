import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

function requiredEnv(value: string | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function readFirebaseOptions(): FirebaseOptions | null {
  const apiKey = requiredEnv(import.meta.env.VITE_FIREBASE_API_KEY);
  const authDomain = requiredEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  const projectId = requiredEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID);
  const storageBucket = requiredEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
  const messagingSenderId = requiredEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
  const appId = requiredEnv(import.meta.env.VITE_FIREBASE_APP_ID);

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    return null;
  }

  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
}

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

export function isFirebaseConfigured(): boolean {
  return readFirebaseOptions() !== null;
}

export function getFirebaseAuth(): Auth {
  const options = readFirebaseOptions();
  if (!options) {
    throw new Error(
      "Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local and restart the dev server.",
    );
  }

  if (!firebaseApp || !firebaseAuth) {
    firebaseApp = initializeApp(options);
    firebaseAuth = getAuth(firebaseApp);
  }

  return firebaseAuth;
}
