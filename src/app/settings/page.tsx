import type { Metadata } from "next";

import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { EMPTY_PROFILE } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Settings – AI Research Workspace",
};

export default function SettingsPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage your profile information.
        </p>
      </div>
      <ProfileSettingsForm initialValues={EMPTY_PROFILE} />
    </div>
  );
}
