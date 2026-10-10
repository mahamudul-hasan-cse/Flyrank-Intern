import type {
  ProfileSettings,
  ProfileSettingsErrors,
  ProfileTextField,
} from "@/types/settings";

export const FULL_NAME_MIN_LENGTH = 2;
export const BIO_MAX_LENGTH = 160;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFullName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Full name is required.";
  if (trimmed.length < FULL_NAME_MIN_LENGTH)
    return `Full name must be at least ${FULL_NAME_MIN_LENGTH} characters.`;
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Email address is required.";
  if (!EMAIL_PATTERN.test(trimmed))
    return "Enter a valid email address, for example name@example.com.";
  return undefined;
}

export function validateBio(value: string): string | undefined {
  if (value.length > BIO_MAX_LENGTH)
    return `Bio must be ${BIO_MAX_LENGTH} characters or fewer (currently ${value.length}).`;
  return undefined;
}

const fieldValidators: Record<ProfileTextField, (value: string) => string | undefined> = {
  fullName: validateFullName,
  email: validateEmail,
  bio: validateBio,
};

export function validateProfileField(
  field: ProfileTextField,
  value: string,
): string | undefined {
  return fieldValidators[field](value);
}

export function validateProfileSettings(
  settings: ProfileSettings,
): ProfileSettingsErrors {
  const errors: ProfileSettingsErrors = {};
  for (const field of Object.keys(fieldValidators) as ProfileTextField[]) {
    const error = validateProfileField(field, settings[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

export function hasErrors(errors: ProfileSettingsErrors): boolean {
  return Object.values(errors).some(Boolean);
}
