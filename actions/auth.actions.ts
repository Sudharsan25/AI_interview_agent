"use server";

import { auth } from "@/lib/config";

/**
 * Server actions for authentication
 */

export async function signIn(email: string, password: string) {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return {
      success: true,
      message: "Signed In Successfully!!",
    };
  } catch (error) {
    const e = error as Error;
    console.log("Error occurred during signIn:", error);
    return {
      success: false,
      message: `Error occurred: ${e.message}`,
    };
  }
}

export async function signUp(
  email: string,
  password: string,
  name: string
) {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    return {
      success: true,
      message: "User created Successfully!!",
    };
  } catch (error) {
    const e = error as Error;
    console.log("Error occurred during signUp:", error);
    return {
      success: false,
      message: `Error occurred: ${e.message}`,
    };
  }
}
