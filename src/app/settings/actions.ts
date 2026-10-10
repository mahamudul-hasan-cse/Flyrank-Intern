"use server";

import {
  hasErrors,
  validateProfileSettings,
} from "@/lib/validation/profile-settings";
import type {
  ProfileSettings,
  SaveProfileSettingsResult,
} from "@/types/settings";

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function saveProfileSettings(
  _previous: SaveProfileSettingsResult,
  formData: FormData,
): Promise<SaveProfileSettingsResult> {
  const settings: ProfileSettings = {
    fullName: readText(formData, "fullName"),
    email: readText(formData, "email"),
    bio: readText(formData, "bio"),
    emailNotifications: formData.get("emailNotifications") === "on",
  };

  const errors = validateProfileSettings(settings);
  if (hasErrors(errors)) {
    return {
      status: "error",
      message: "Your settings could not be saved. Please correct the highlighted fields.",
      errors,
    };
  }

  // TODO: persist settings once a data store exists.
  return {
    status: "success",
    message: "Settings saved.",
    settings: {
      ...settings,
      fullName: settings.fullName.trim(),
      email: settings.email.trim(),
      bio: settings.bio.trim(),
    },
  };
}
