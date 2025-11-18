export type AdminLoginRequest = {
  email: string;
  password: string;
};

export type AdminSessionUser = {
  name?: string | null;
  email?: string | null;
  role?: "admin" | "user";
};
