"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";

import { saveProfileSettings } from "@/app/settings/actions";
import { TextField } from "@/components/ui/text-field";
import {
  BIO_MAX_LENGTH,
  validateProfileField,
  validateProfileSettings,
} from "@/lib/validation/profile-settings";
import type {
  ProfileSettings,
  ProfileSettingsErrors,
  ProfileTextField,
  SaveProfileSettingsResult,
} from "@/types/settings";

const FIELD_ORDER: ProfileTextField[] = ["fullName", "email", "bio"];

const initialResult: SaveProfileSettingsResult = { status: "idle" };

type ProfileSettingsFormProps = {
  initialSettings: ProfileSettings;
};

export function ProfileSettingsForm({ initialSettings }: ProfileSettingsFormProps) {
  const [result, submitAction, isPending] = useActionState(
    saveProfileSettings,
    initialResult,
  );
  const [settings, setSettings] = useState<ProfileSettings>(initialSettings);
  const [errors, setErrors] = useState<ProfileSettingsErrors>({});
  const [showResult, setShowResult] = useState(false);

  function updateText(field: ProfileTextField, value: string) {
    setSettings((previous) => ({ ...previous, [field]: value }));
    setShowResult(false);
    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: validateProfileField(field, value),
      }));
    }
  }

  function validateOnBlur(field: ProfileTextField) {
    setErrors((previous) => ({
      ...previous,
      [field]: validateProfileField(field, settings[field]),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    const form = event.currentTarget;
    const nextErrors = validateProfileSettings(settings);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setShowResult(false);
      const control = form.elements.namedItem(firstInvalid);
      if (control instanceof HTMLElement) control.focus();
      return;
    }

    setShowResult(true);
    const formData = new FormData(form);
    startTransition(() => submitAction(formData));
  }

  function errorFor(field: ProfileTextField): string | undefined {
    if (errors[field]) return errors[field];
    if (showResult && result.status === "error") return result.errors[field];
    return undefined;
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby="profile-settings-heading"
      aria-busy={isPending}
      className="flex flex-col gap-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
    >
      <h2 id="profile-settings-heading" className="text-lg font-semibold">
        Profile
      </h2>

      <TextField
        id="fullName"
        label="Full name"
        required
        autoComplete="name"
        value={settings.fullName}
        onChange={(value) => updateText("fullName", value)}
        onBlur={() => validateOnBlur("fullName")}
        error={errorFor("fullName")}
      />

      <TextField
        id="email"
        label="Email address"
        type="email"
        required
        autoComplete="email"
        value={settings.email}
        onChange={(value) => updateText("email", value)}
        onBlur={() => validateOnBlur("email")}
        error={errorFor("email")}
      />

      <TextField
        id="bio"
        label="Short bio"
        multiline
        value={settings.bio}
        onChange={(value) => updateText("bio", value)}
        onBlur={() => validateOnBlur("bio")}
        error={errorFor("bio")}
        hint={`Optional. ${settings.bio.length}/${BIO_MAX_LENGTH} characters.`}
      />

      <div className="flex items-start gap-3">
        <input
          id="emailNotifications"
          name="emailNotifications"
          type="checkbox"
          aria-describedby="emailNotifications-hint"
          checked={settings.emailNotifications}
          onChange={(event) => {
            const { checked } = event.target;
            setSettings((previous) => ({ ...previous, emailNotifications: checked }));
            setShowResult(false);
          }}
          className="mt-0.5 size-4 rounded border-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-zinc-700"
        />
        <div className="flex flex-col">
          <label htmlFor="emailNotifications" className="text-sm">
            Email notifications
          </label>
          <p
            id="emailNotifications-hint"
            className="text-xs text-zinc-500 dark:text-zinc-400"
          >
            Receive updates about your research workspaces by email.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isPending ? "Saving…" : "Save Settings"}
        </button>

        <div role="status" aria-live="polite" className="text-sm">
          {showResult && !isPending && result.status === "success" && (
            <p className="rounded-md bg-green-50 px-3 py-2 font-medium text-green-800 dark:bg-green-950 dark:text-green-200">
              {result.message}
            </p>
          )}
          {showResult && !isPending && result.status === "error" && (
            <p className="text-red-600 dark:text-red-400">{result.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}
