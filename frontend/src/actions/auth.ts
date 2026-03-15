"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Why: The 'export' keyword here is mandatory. Without it, LoginForm.tsx cannot import this type.
export type LoginState = {
  error: string | undefined;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Authentication failed." };
    }

    cookies().set("jwt_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });
  } catch (error) {
    console.error("[Login Action Error]:", error);
    return { error: "Network error. The server might be unreachable." };
  }

  redirect("/overview");
}

export async function logoutAction() {
  // Why: Delete the specific HttpOnly cookie by instructing the browser to expire it immediately.
  cookies().delete({
    name: 'session_token',
    path: '/', // Why: Must match the path used when the cookie was initially set.
  });

  // Why: Force the user back to the login screen. This inherently throws an error to halt execution, so it must stay outside try/catch.
  redirect('/login');
}