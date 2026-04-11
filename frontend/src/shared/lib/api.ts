import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

interface FetchOptions extends RequestInit {
  // Add custom options if needed later (e.g., skipAuth)
}

/**
 * Server-side fetch wrapper for communicating with the Express backend.
 * Why: Automatically attaches the JWT and standardizes error handling.
 */
export async function serverFetch(endpoint: string, options: FetchOptions = {}) {
  const cookieStore = cookies();
  const token = cookieStore.get("jwt_token")?.value;

  // Why: Remove trailing slash from API_URL if it exists
  const baseUrl = process.env.API_URL?.replace(/\/$/, "");
  // Why: Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const fullUrl = `${baseUrl}${cleanEndpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Why: If a token exists, inject it securely into the header.
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Why: Use the validated fullUrl
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Why: Cache server-fetched data for 30 seconds to avoid redundant backend calls during rapid navigation.
    // Individual callers can override this via options.
    next: { revalidate: 30, ...(options as any).next },
  });

  // Why: Centralized 401 handling. If the Express middleware rejects the token, immediately force a re-login.
  if (response.status === 401) {
    // Optional: You could delete the invalid cookie here before redirecting.
    redirect("/login");
  }

  // Why: Ensure the caller knows if the request failed (e.g., 403 Forbidden, 404 Not Found).
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Cached user fetcher — deduplicated per React Server Component render pass.
 * Why: The dashboard layout AND every page both call getUser(). React.cache() ensures
 * only ONE actual HTTP request is made to the Express backend per incoming browser request,
 * eliminating the redundant round-trip that was the main source of navigation delay.
 */
export const getUser = cache(async () => {
  return serverFetch("/api/v1/users/me");
});