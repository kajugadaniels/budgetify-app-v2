import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextResponse } from "next/server";

import { ACTIVITY_TYPES, logActivity } from "@/lib/activity-log";
import { getPrisma } from "@/lib/prisma";

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkPhoneNumber = {
  id: string;
  phone_number: string;
};

type ClerkUserPayload = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  primary_email_address_id?: string | null;
  primary_phone_number_id?: string | null;
  email_addresses?: ClerkEmailAddress[];
  phone_numbers?: ClerkPhoneNumber[];
};

function pickPrimaryEmail(user: ClerkUserPayload) {
  if (!user.email_addresses?.length) return null;
  if (!user.primary_email_address_id) return user.email_addresses[0]?.email_address ?? null;
  return (
    user.email_addresses.find(
      (email) => email.id === user.primary_email_address_id
    )?.email_address ?? null
  );
}

function pickPrimaryPhone(user: ClerkUserPayload) {
  if (!user.phone_numbers?.length) return null;
  if (!user.primary_phone_number_id) return user.phone_numbers[0]?.phone_number ?? null;
  return (
    user.phone_numbers.find((phone) => phone.id === user.primary_phone_number_id)
      ?.phone_number ?? null
  );
}

export async function POST(request: Request) {
  try {
    const prisma = await getPrisma();
    const event = await verifyWebhook(request);
    const userAgent = request.headers.get("user-agent");
    const ipAddress = request.headers.get("x-forwarded-for");

    if (event.type === "user.created" || event.type === "user.updated") {
      const payload = event.data as ClerkUserPayload;
      const email = pickPrimaryEmail(payload);
      const phone = pickPrimaryPhone(payload);

      const user = await prisma.user.upsert({
        where: { clerkId: payload.id },
        create: {
          clerkId: payload.id,
          firstname: payload.first_name ?? "",
          lastname: payload.last_name ?? "",
          email,
          phone,
        },
        update: {
          firstname: payload.first_name ?? "",
          lastname: payload.last_name ?? "",
          email,
          phone,
        },
      });

      await logActivity({
        userId: user.id,
        activity:
          event.type === "user.created"
            ? ACTIVITY_TYPES.USER_REGISTERED
            : ACTIVITY_TYPES.USER_UPDATED,
        description:
          event.type === "user.created"
            ? "User registered via Clerk."
            : "User profile synced from Clerk.",
        metadata: { clerkEventId: event.data?.id ?? null },
        ipAddress,
        userAgent,
      });
    }

    if (event.type === "session.created") {
      const payload = event.data as { user_id: string; id: string };

      const user = await prisma.user.findUnique({
        where: { clerkId: payload.user_id },
        select: { id: true },
      });

      if (user) {
        await logActivity({
          userId: user.id,
          activity: ACTIVITY_TYPES.USER_SIGNED_IN,
          description: "User logged in.",
          metadata: { sessionId: payload.id },
          ipAddress,
          userAgent,
        });
      }
    }

    if (event.type === "user.deleted") {
      const payload = event.data as { id?: string | null };
      if (payload.id) {
        await prisma.user.deleteMany({
          where: { clerkId: payload.id },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to process Clerk webhook", error);
    return NextResponse.json({ error: "Invalid webhook request" }, { status: 400 });
  }
}
