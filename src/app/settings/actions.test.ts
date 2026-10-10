import { describe, expect, it } from "vitest";

import { saveProfileSettings } from "./actions";

function toFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

describe("saveProfileSettings", () => {
  it("rejects invalid data on the server", async () => {
    const result = await saveProfileSettings(
      { status: "idle" },
      toFormData({ fullName: "A", email: "bad", bio: "a".repeat(161) }),
    );

    expect(result).toEqual({
      status: "error",
      message: expect.any(String),
      errors: {
        fullName: "Full name must be at least 2 characters.",
        email: "Enter a valid email address, for example name@example.com.",
        bio: "Bio must be 160 characters or fewer (currently 161).",
      },
    });
  });

  it("treats missing fields as empty", async () => {
    const result = await saveProfileSettings({ status: "idle" }, new FormData());

    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.errors).toEqual({
        fullName: "Full name is required.",
        email: "Email address is required.",
      });
    }
  });

  it("returns trimmed settings on success", async () => {
    const result = await saveProfileSettings(
      { status: "idle" },
      toFormData({
        fullName: "  Ada Lovelace  ",
        email: " ada@example.com ",
        bio: " Mathematician ",
        emailNotifications: "on",
      }),
    );

    expect(result).toEqual({
      status: "success",
      message: "Settings saved.",
      settings: {
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        bio: "Mathematician",
        emailNotifications: true,
      },
    });
  });

  it("reads an unchecked notifications box as false", async () => {
    const result = await saveProfileSettings(
      { status: "idle" },
      toFormData({ fullName: "Ada", email: "ada@example.com" }),
    );

    expect(result.status === "success" && result.settings.emailNotifications).toBe(false);
  });
});
