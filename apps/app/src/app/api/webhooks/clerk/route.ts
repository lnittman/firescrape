import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { db } from "@repo/database";
import type {
  DeletedObjectJSON,
  OrganizationJSON,
  OrganizationMembershipJSON,
  UserJSON,
  WebhookEvent,
} from "@repo/auth/server";


const handleUserUpsert = async (data: UserJSON) => {
  try {
    // Upsert user record in database (create or update if exists)
    const email = data.email_addresses?.[0]?.email_address ?? "";
    const result = await db.profile.upsert({
      where: {
        clerkId: data.id,
      },
      create: {
        clerkId: data.id,
        email,
        username: data.username ?? data.first_name?.toLowerCase() ?? `user_${data.id.slice(-8)}`,
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        avatarUrl: data.image_url || null,
      },
      update: {
        email,
        username: data.username ?? data.first_name?.toLowerCase() ?? `user_${data.id.slice(-8)}`,
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        avatarUrl: data.image_url || null,
      },
    });

    console.log(`Upserted user record for ${data.id}`);
    return result;
  } catch (error) {
    console.error("Failed to upsert user record:", { error, userId: data.id });
    throw error;
  }
};

export const POST = async (request: Request) => {
  const body = await request.text();
  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixIdTimeStamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.error("Missing required headers");
    return new Response("Error occurred", { status: 400 });
  }

  const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let event: WebhookEvent;

  try {
    event = svix.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixIdTimeStamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Failed to verify webhook:", error);
    return new Response("Error occurred", { status: 400 });
  }

  const eventType = event.type;
  console.log("Webhook received:", eventType);

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated":
        await handleUserUpsert(event.data);
        break;
      
      // We can add more event handlers as needed
      case "user.deleted":
      case "organization.created":
      case "organization.updated":
      case "organizationMembership.created":
      case "organizationMembership.deleted":
        // For MVP, we just log these events
        console.log(`Received ${eventType} event for ${event.data.id}`);
        break;
        
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
};