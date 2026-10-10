import type { Metadata } from "next";

import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import type { ProfileSettings } from "@/types/settings";

export const metadata: Metadata = {
  title: "Settings – AI Research Workspace",
};

const defaultSettings: ProfileSettings = {
  fullName: "",
  email: "",
  bio: "",
  emailNotifications: false,
};

export default function SettingsPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage your profile and notification preferences.
        </p>
      </div>
      <ProfileSettingsForm initialSettings={defaultSettings} />
    </div>
  );
}
