"use server";

import { auth } from "@repo/auth/server";
import { db } from "@repo/database";
import { revalidatePath } from "next/cache";

export async function clearAllUserData() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    // Find the user by clerkId
    const user = await db.profile.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete all user data in a transaction
    await db.$transaction(async (tx) => {
      // Delete all scrape runs
      await tx.scrape.deleteMany({
        where: { userId: user.id },
      });

      // Delete user feedback
      await tx.feedback.deleteMany({
        where: { userId: user.id },
      });
    });

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath("/runs");
    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    console.error("Error clearing user data:", error);
    throw new Error("Failed to clear user data");
  }
}
