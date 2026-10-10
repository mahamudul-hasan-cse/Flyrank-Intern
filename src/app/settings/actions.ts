"use server";

import {
  normalizeProfile,
  validateProfile,
  type ProfileErrors,
  type ProfileValues,
} from "@/lib/profile";

export type ProfileFormState =
  | { status: "idle" }
  | { status: "success"; message: string; values: ProfileValues }
  | { status: "error"; message: string; errors: ProfileErrors };

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const values: ProfileValues = {
    displayName: readString(formData, "displayName"),
    email: readString(formData, "email"),
    bio: readString(formData, "bio"),
    website: readString(formData, "website"),
  };

  const errors = validateProfile(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Some fields are invalid. Please review your profile.",
      errors,
    };
  }

  // TODO: persist the profile once a data store is added.
  return {
    status: "success",
    message: "Profile saved.",
    values: normalizeProfile(values),
  };
}
