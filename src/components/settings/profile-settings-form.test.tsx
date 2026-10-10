import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ProfileSettings, SaveProfileSettingsResult } from "@/types/settings";

import { ProfileSettingsForm } from "./profile-settings-form";

const saveProfileSettings = vi.hoisted(() =>
  vi.fn<(previous: SaveProfileSettingsResult, formData: FormData) => Promise<SaveProfileSettingsResult>>(),
);

vi.mock("@/app/settings/actions", () => ({ saveProfileSettings }));

const emptySettings: ProfileSettings = {
  fullName: "",
  email: "",
  bio: "",
  emailNotifications: false,
};

function renderForm() {
  const user = userEvent.setup();
  render(<ProfileSettingsForm initialSettings={emptySettings} />);
  return {
    user,
    fullName: screen.getByRole("textbox", { name: "Full name" }),
    email: screen.getByRole("textbox", { name: "Email address" }),
    bio: screen.getByRole("textbox", { name: "Short bio" }),
    notifications: screen.getByRole("checkbox", { name: "Email notifications" }),
    submit: screen.getByRole("button", { name: "Save Settings" }),
  };
}

function successResult(settings: ProfileSettings): SaveProfileSettingsResult {
  return { status: "success", message: "Settings saved.", settings };
}

let settlePendingSave: (() => void) | undefined;

beforeEach(() => {
  saveProfileSettings.mockReset();
});

// React entangles async transitions, so a save left pending by a failed
// assertion would block every later test's submission.
afterEach(async () => {
  await act(async () => settlePendingSave?.());
  settlePendingSave = undefined;
});

describe("ProfileSettingsForm", () => {
  it("renders every field with an accessible label", () => {
    const { fullName, email, bio, notifications, submit } = renderForm();

    expect(fullName).toBeRequired();
    expect(email).toBeRequired();
    expect(email).toHaveAttribute("type", "email");
    expect(bio).not.toBeRequired();
    expect(notifications).not.toBeChecked();
    expect(notifications).toHaveAccessibleDescription(
      "Receive updates about your research workspaces by email.",
    );
    expect(submit).toBeEnabled();
  });

  it("blocks submission of an empty form and explains each error", async () => {
    const { user, fullName, email, submit } = renderForm();

    await user.click(submit);

    expect(saveProfileSettings).not.toHaveBeenCalled();
    expect(fullName).toHaveAttribute("aria-invalid", "true");
    expect(fullName).toHaveAccessibleDescription("Full name is required.");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Email address is required.");
    expect(fullName).toHaveFocus();
  });

  it("preserves entered values and focuses the first invalid field", async () => {
    const { user, fullName, email, bio, notifications, submit } = renderForm();

    await user.type(fullName, "Ada Lovelace");
    await user.type(email, "not-an-email");
    await user.type(bio, "Researcher");
    await user.click(notifications);
    await user.click(submit);

    expect(saveProfileSettings).not.toHaveBeenCalled();
    expect(fullName).toHaveValue("Ada Lovelace");
    expect(email).toHaveValue("not-an-email");
    expect(bio).toHaveValue("Researcher");
    expect(notifications).toBeChecked();
    expect(fullName).not.toHaveAttribute("aria-invalid");
    expect(email).toHaveAccessibleDescription(
      "Enter a valid email address, for example name@example.com.",
    );
    expect(email).toHaveFocus();
  });

  it("rejects a full name shorter than 2 characters", async () => {
    const { user, fullName, submit } = renderForm();

    await user.type(fullName, "A");
    await user.click(submit);

    expect(fullName).toHaveAccessibleDescription(
      "Full name must be at least 2 characters.",
    );
  });

  it("rejects a bio longer than 160 characters", async () => {
    const { user, fullName, email, bio, submit } = renderForm();

    await user.type(fullName, "Ada Lovelace");
    await user.type(email, "ada@example.com");
    await user.click(bio);
    await user.paste("a".repeat(161));
    await user.click(submit);

    expect(saveProfileSettings).not.toHaveBeenCalled();
    expect(bio).toHaveAttribute("aria-invalid", "true");
    expect(bio).toHaveAccessibleDescription(
      "Bio must be 160 characters or fewer (currently 161). Optional. 161/160 characters.",
    );
  });

  it("shows a field error on blur and clears it once the value is fixed", async () => {
    const { user, email } = renderForm();

    await user.type(email, "ada@");
    await user.tab();
    expect(email).toHaveAttribute("aria-invalid", "true");

    await user.type(email, "example.com");
    expect(email).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByText(/valid email address/)).not.toBeInTheDocument();
  });

  it("submits valid data, disables the button while saving, and shows success", async () => {
    let resolveSave: (result: SaveProfileSettingsResult) => void = () => {};
    saveProfileSettings.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
          settlePendingSave = () => resolve({ status: "idle" });
        }),
    );
    const { user, fullName, email, bio, notifications, submit } = renderForm();

    await user.type(fullName, "Ada Lovelace");
    await user.type(email, "ada@example.com");
    await user.type(bio, "Mathematician");
    await user.click(notifications);
    await user.click(submit);

    expect(saveProfileSettings).toHaveBeenCalledTimes(1);
    const formData = saveProfileSettings.mock.calls[0][1];
    expect(Object.fromEntries(formData)).toEqual({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      bio: "Mathematician",
      emailNotifications: "on",
    });

    const savingButton = screen.getByRole("button", { name: "Saving…" });
    expect(savingButton).toBeDisabled();

    await act(async () => {
      resolveSave(
        successResult({
          fullName: "Ada Lovelace",
          email: "ada@example.com",
          bio: "Mathematician",
          emailNotifications: true,
        }),
      );
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Settings saved.");
    expect(screen.getByRole("button", { name: "Save Settings" })).toBeEnabled();
    expect(fullName).toHaveValue("Ada Lovelace");
  });

  it("hides the success message after the user edits a field", async () => {
    saveProfileSettings.mockResolvedValue(
      successResult({ ...emptySettings, fullName: "Ada", email: "ada@example.com" }),
    );
    const { user, fullName, email, submit } = renderForm();

    await user.type(fullName, "Ada");
    await user.type(email, "ada@example.com");
    await user.click(submit);
    expect(await screen.findByText("Settings saved.")).toBeInTheDocument();

    await user.type(fullName, "!");
    expect(screen.queryByText("Settings saved.")).not.toBeInTheDocument();
  });

  it("shows server-side validation errors next to the field", async () => {
    saveProfileSettings.mockResolvedValue({
      status: "error",
      message: "Your settings could not be saved. Please correct the highlighted fields.",
      errors: { email: "Email address is required." },
    });
    const { user, fullName, email, submit } = renderForm();

    await user.type(fullName, "Ada");
    await user.type(email, "ada@example.com");
    await user.click(submit);

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Your settings could not be saved.",
    );
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Email address is required.");
  });

  it("is fully operable with the keyboard", async () => {
    saveProfileSettings.mockResolvedValue(
      successResult({ ...emptySettings, fullName: "Ada", email: "ada@example.com" }),
    );
    const { user, fullName, email, bio, notifications, submit } = renderForm();

    await user.tab();
    expect(fullName).toHaveFocus();
    await user.keyboard("Ada");

    await user.tab();
    expect(email).toHaveFocus();
    await user.keyboard("ada@example.com");

    await user.tab();
    expect(bio).toHaveFocus();

    await user.tab();
    expect(notifications).toHaveFocus();
    await user.keyboard(" ");
    expect(notifications).toBeChecked();

    await user.tab();
    expect(submit).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(await screen.findByText("Settings saved.")).toBeInTheDocument();
    expect(saveProfileSettings).toHaveBeenCalledTimes(1);
  });
});
