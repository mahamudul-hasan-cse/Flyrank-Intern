export type ProfileSettings = {
  fullName: string;
  email: string;
  bio: string;
  emailNotifications: boolean;
};

export type ProfileTextField = "fullName" | "email" | "bio";

export type ProfileSettingsErrors = Partial<Record<ProfileTextField, string>>;

export type SaveProfileSettingsResult =
  | { status: "idle" }
  | { status: "success"; message: string; settings: ProfileSettings }
  | { status: "error"; message: string; errors: ProfileSettingsErrors };
