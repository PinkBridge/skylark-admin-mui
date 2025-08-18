import { toast } from "material-react-toastify";
import { useUserStore } from "../stores/userStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
export interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export async function api<T = any>(
  url: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token } = useUserStore.getState()

  let fullUrl = url.startsWith("http") ? url : API_BASE_URL.replace(/\/$/, "") + "/" + url.replace(/^\//, "");
  if (options.params) {
    const query = new URLSearchParams(options.params).toString();
    fullUrl += (fullUrl.includes("?") ? "&" : "?") + query
  }
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    toast.error(error.msg || "An error occurred")
    // if 401 not authorized, redirect to login page
    if (res.status === 401 && !url.includes("/auth/login") && !url.includes("/auth/register")) {
      localStorage.removeItem("user-storage")
      window.location.href = "/auth/login"
      return null as T
    }
    if (res.status === 403) {
      toast.error("Permission denied")
      return null as T
    }
  }
  if (res.status === 204) return null as T
  return res.json() as Promise<T>;
} 