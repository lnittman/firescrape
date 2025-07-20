"use server";

import { auth } from "@repo/auth/server";
import { userService } from "@repo/api";

export async function clearAllUserData() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Use the userService to clear all user data
    const result = await userService.clearAllUserData(userId);

    return result;
  } catch (error) {
    console.error("Error clearing user data:", error);
    throw new Error("Failed to clear user data");
  }
}
