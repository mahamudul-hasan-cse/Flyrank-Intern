"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";

import { updateProfile, type ProfileFormState } from "@/app/settings/actions";
import { FormField } from "@/components/ui/form-field";
import {
  PROFILE_LIMITS,
  validateProfile,
  validateProfileField,
  type ProfileErrors,
  type ProfileField,
  type ProfileValues,
} from "@/lib/profile";

const FIELD_ORDER: ProfileField[] = ["displayName", "email", "bio", "website"];

const initialState: ProfileFormState = { status: "idle" };

type ProfileSettingsFormProps = {
  initialValues: ProfileValues;
};

export function ProfileSettingsForm({ initialValues }: ProfileSettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const [values, setValues] = useState<ProfileValues>(initialValues);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ProfileField, boolean>>>({});
  const [showStatus, setShowStatus] = useState(false);

  function handleChange(field: ProfileField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setShowStatus(false);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateProfileField(field, value) }));
    }
  }

  function handleBlur(field: ProfileField) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateProfileField(field, values[field]) }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const nextErrors = validateProfile(values);
    setErrors(nextErrors);
    setTouched({ displayName: true, email: true, bio: true, website: true });

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setShowStatus(false);
      const element = form.elements.namedItem(firstInvalid);
      if (element instanceof HTMLElement) element.focus();
      return;
    }

    setShowStatus(true);
    const formData = new FormData(form);
    startTransition(() => formAction(formData));
  }

  const errorCount = FIELD_ORDER.filter((field) => errors[field]).length;

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby="profile-settings-heading"
      className="flex flex-col gap-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
    >
      <div className="flex flex-col gap-1">
        <h2 id="profile-settings-heading" className="text-lg font-semibold">
          Profile
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This information is shown on your research workspaces.
        </p>
      </div>

      {errorCount > 0 && (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          {errorCount === 1
            ? "There is 1 problem with your profile."
            : `There are ${errorCount} problems with your profile.`}
        </div>
      )}

      <FormField
        id="displayName"
        name="displayName"
        label="Display name"
        required
        autoComplete="name"
        value={values.displayName}
        onChange={(value) => handleChange("displayName", value)}
        onBlur={() => handleBlur("displayName")}
        error={errors.displayName}
        hint={`${PROFILE_LIMITS.displayNameMin}–${PROFILE_LIMITS.displayNameMax} characters.`}
      />

      <FormField
        id="email"
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        value={values.email}
        onChange={(value) => handleChange("email", value)}
        onBlur={() => handleBlur("email")}
        error={errors.email}
      />

      <FormField
        id="bio"
        name="bio"
        label="Bio"
        multiline
        rows={4}
        value={values.bio}
        onChange={(value) => handleChange("bio", value)}
        onBlur={() => handleBlur("bio")}
        error={errors.bio}
        hint={`${values.bio.length}/${PROFILE_LIMITS.bioMax} characters`}
      />

      <FormField
        id="website"
        name="website"
        label="Website"
        type="url"
        autoComplete="url"
        placeholder="https://example.com"
        value={values.website}
        onChange={(value) => handleChange("website", value)}
        onBlur={() => handleBlur("website")}
        error={errors.website}
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          aria-disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>

        <p aria-live="polite" className="text-sm">
          {showStatus && !pending && state.status === "success" && (
            <span className="text-green-700 dark:text-green-400">{state.message}</span>
          )}
          {showStatus && !pending && state.status === "error" && (
            <span className="text-red-600 dark:text-red-400">{state.message}</span>
          )}
        </p>
      </div>
    </form>
  );
}
