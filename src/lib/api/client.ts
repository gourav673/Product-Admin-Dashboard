// The one shared Axios instance. Every API call in the app goes through here.
// - The request interceptor adds the login token to every request.
// - The response interceptor turns every failure into one ApiError shape,
//   and logs the user out when the token is rejected (401).

import axios, { AxiosError } from "axios";
import { clearSession, getToken } from "@/lib/auth/session";

export class ApiError extends Error {
  status: number | null;
  /** true when the request was cancelled on purpose (e.g. a newer search started). */
  canceled: boolean;

  constructor(message: string, status: number | null, canceled = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.canceled = canceled;
  }
}

export const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (axios.isCancel(error)) {
      return Promise.reject(new ApiError("Request cancelled", null, true));
    }

    const status = error.response?.status ?? null;
    const isLoginCall = error.config?.url?.includes("/auth/login");

    if (status === 401 && !isLoginCall && typeof window !== "undefined") {
      clearSession();
      window.location.href = `/login?expired=1`;
    }

    let message = error.response?.data?.message;
    if (!message) {
      if (error.code === "ECONNABORTED") message = "The server took too long to respond.";
      else if (!error.response) message = "Network error. Check your connection and try again.";
      else message = `Something went wrong (error ${status}).`;
    }

    return Promise.reject(new ApiError(message, status));
  },
);

export function isCanceled(error: unknown): boolean {
  return error instanceof ApiError && error.canceled;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}
