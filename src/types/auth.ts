export type AuthUser = {
  uid: string;
  email: string | null;
};

export type AuthStatus = "loading" | "ready" | "unconfigured";
