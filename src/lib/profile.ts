export type ProfileValues = {
  displayName: string;
  email: string;
  bio: string;
  website: string;
};

export type ProfileField = keyof ProfileValues;

export type ProfileErrors = Partial<Record<ProfileField, string>>;

export const PROFILE_LIMITS = {
  displayNameMin: 2,
  displayNameMax: 50,
  bioMax: 160,
} as const;

export const EMPTY_PROFILE: ProfileValues = {
  displayName: "",
  email: "",
  bio: "",
  website: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateProfileField(
  field: ProfileField,
  rawValue: string,
): string | undefined {
  const value = rawValue.trim();

  switch (field) {
    case "displayName":
      if (!value) return "Display name is required.";
      if (value.length < PROFILE_LIMITS.displayNameMin)
        return `Display name must be at least ${PROFILE_LIMITS.displayNameMin} characters.`;
      if (value.length > PROFILE_LIMITS.displayNameMax)
        return `Display name must be ${PROFILE_LIMITS.displayNameMax} characters or fewer.`;
      return undefined;

    case "email":
      if (!value) return "Email is required.";
      if (!EMAIL_PATTERN.test(value)) return "Enter a valid email address.";
      return undefined;

    case "bio":
      if (value.length > PROFILE_LIMITS.bioMax)
        return `Bio must be ${PROFILE_LIMITS.bioMax} characters or fewer.`;
      return undefined;

    case "website": {
      if (!value) return undefined;
      try {
        const url = new URL(value);
        if (url.protocol !== "http:" && url.protocol !== "https:")
          return "Website must start with http:// or https://.";
        return undefined;
      } catch {
        return "Enter a valid URL, for example https://example.com.";
      }
    }
  }
}

export function validateProfile(values: ProfileValues): ProfileErrors {
  const errors: ProfileErrors = {};
  for (const field of Object.keys(values) as ProfileField[]) {
    const error = validateProfileField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

export function normalizeProfile(values: ProfileValues): ProfileValues {
  return {
    displayName: values.displayName.trim(),
    email: values.email.trim().toLowerCase(),
    bio: values.bio.trim(),
    website: values.website.trim(),
  };
}
