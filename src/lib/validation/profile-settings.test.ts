import { describe, expect, it } from "vitest";

import {
  BIO_MAX_LENGTH,
  validateBio,
  validateEmail,
  validateFullName,
  validateProfileSettings,
} from "./profile-settings";

describe("validateFullName", () => {
  it("requires a value", () => {
    expect(validateFullName("")).toBe("Full name is required.");
  });

  it("treats whitespace-only input as empty", () => {
    expect(validateFullName("   ")).toBe("Full name is required.");
  });

  it("requires at least 2 characters after trimming", () => {
    expect(validateFullName(" A ")).toBe(
      "Full name must be at least 2 characters.",
    );
  });

  it("accepts a name with 2 or more characters", () => {
    expect(validateFullName("Al")).toBeUndefined();
    expect(validateFullName("Md. Mahamudul Hasan")).toBeUndefined();
  });
});

describe("validateEmail", () => {
  it("requires a value", () => {
    expect(validateEmail("")).toBe("Email address is required.");
    expect(validateEmail("   ")).toBe("Email address is required.");
  });

  it.each(["plainaddress", "name@", "@example.com", "name@example", "na me@example.com"])(
    "rejects %s",
    (value) => {
      expect(validateEmail(value)).toMatch(/valid email address/);
    },
  );

  it.each(["name@example.com", "first.last+tag@sub.example.co", " name@example.com "])(
    "accepts %s",
    (value) => {
      expect(validateEmail(value)).toBeUndefined();
    },
  );
});

describe("validateBio", () => {
  it("is optional", () => {
    expect(validateBio("")).toBeUndefined();
  });

  it(`accepts exactly ${BIO_MAX_LENGTH} characters`, () => {
    expect(validateBio("a".repeat(BIO_MAX_LENGTH))).toBeUndefined();
  });

  it(`rejects more than ${BIO_MAX_LENGTH} characters`, () => {
    expect(validateBio("a".repeat(BIO_MAX_LENGTH + 1))).toBe(
      `Bio must be ${BIO_MAX_LENGTH} characters or fewer (currently ${BIO_MAX_LENGTH + 1}).`,
    );
  });
});

describe("validateProfileSettings", () => {
  it("returns no errors for valid settings", () => {
    expect(
      validateProfileSettings({
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        bio: "",
        emailNotifications: true,
      }),
    ).toEqual({});
  });

  it("returns an error for every invalid field", () => {
    expect(
      validateProfileSettings({
        fullName: "",
        email: "bad",
        bio: "a".repeat(BIO_MAX_LENGTH + 1),
        emailNotifications: false,
      }),
    ).toEqual({
      fullName: expect.any(String),
      email: expect.any(String),
      bio: expect.any(String),
    });
  });
});
