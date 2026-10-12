import { FirebaseError } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import type { Movie } from "../models/movie.ts";
import { getFirestoreDb } from "./firebase.ts";

export type StoredFavorite = {
  imdbID: string;
  title: string;
  year: string;
  posterUrl: string | null;
};

function favoritesCollection(uid: string) {
  return collection(getFirestoreDb(), "users", uid, "favorites");
}

function favoriteDocument(uid: string, imdbId: string) {
  return doc(getFirestoreDb(), "users", uid, "favorites", imdbId);
}

function textField(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function toMovie(id: string, value: unknown): Movie {
  const record = typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
  const poster = record.posterUrl;
  return {
    id: textField(record.imdbID, id),
    title: textField(record.title, "Untitled"),
    year: textField(record.year, ""),
    posterUrl: typeof poster === "string" && poster.trim().length > 0 ? poster : null,
  };
}

function favoritesError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    if (error.code === "permission-denied") {
      return new Error(
        "Favorites are blocked by Firestore rules. Allow each signed-in user to read and write only users/{uid}/favorites.",
      );
    }
    if (error.code === "unavailable" || error.code === "failed-precondition") {
      return new Error("Firestore is unavailable. Create a Firestore database in the Firebase console and try again.");
    }
  }
  if (error instanceof Error) return error;
  return new Error("Favorites could not be updated. Please try again.");
}

const UNAVAILABLE_MESSAGE =
  "Firestore is unavailable. Create a Firestore database in the Firebase console and try again.";

async function confirmServerWrite(write: Promise<void>): Promise<void> {
  let timeoutId = 0;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(UNAVAILABLE_MESSAGE)), 10000);
  });

  try {
    await Promise.race([write, timeout]);
  } catch (error: unknown) {
    throw favoritesError(error);
  } finally {
    clearTimeout(timeoutId);
  }
}

export function watchFavorites(
  uid: string,
  onChange: (movies: Movie[]) => void,
  onError: (error: Error) => void,
): () => void {
  return onSnapshot(
    favoritesCollection(uid),
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
      onChange(snapshot.docs.map((entry) => toMovie(entry.id, entry.data())));
    },
    (error) => onError(favoritesError(error)),
  );
}

export async function saveFavorite(uid: string, movie: Movie): Promise<void> {
  const favorite: StoredFavorite = {
    imdbID: movie.id,
    title: movie.title,
    year: movie.year,
    posterUrl: movie.posterUrl,
  };

  await confirmServerWrite(setDoc(favoriteDocument(uid, movie.id), favorite));
}

export async function removeFavorite(uid: string, imdbId: string): Promise<void> {
  await confirmServerWrite(deleteDoc(favoriteDocument(uid, imdbId)));
}
