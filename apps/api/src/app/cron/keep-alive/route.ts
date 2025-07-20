import { database } from "@repo/database";

export const GET = async () => {
  // Simple database query to keep the connection alive
  try {
    const count = await database.user.count();
    return new Response(`OK - ${count} users`, { status: 200 });
  } catch (error) {
    console.error("Keep-alive error:", error);
    return new Response("Error", { status: 500 });
  }
};