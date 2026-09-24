import { api } from "./client";
import type { AuthUser, LoginCredentials, LoginResponse } from "@/types/auth";

export const SESSION_MINUTES = 60;

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    ...credentials,
    expiresInMins: SESSION_MINUTES,
  });
  return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}
