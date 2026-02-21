import { clerkClient } from "@clerk/nextjs/server";

import { ACTIVITY_TYPES, logActivity } from "@/lib/activity-log";
import { getPrisma } from "@/lib/prisma";

type EnsureClerkUserSyncedParams = {
  clerkUserId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type MinimalClerkUser = {
  firstName: string | null;
  lastName: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  phoneNumbers: Array<{ phoneNumber: string }>;
  primaryEmailAddress: { emailAddress: string } | null;
  primaryPhoneNumber: { phoneNumber: string } | null;
};

function pickPrimaryEmail(user: MinimalClerkUser) {
  if (!user.emailAddresses.length) return null;
  return user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;
}

function pickPrimaryPhone(user: MinimalClerkUser) {
  if (!user.phoneNumbers.length) return null;
  return user.primaryPhoneNumber?.phoneNumber ?? user.phoneNumbers[0]?.phoneNumber ?? null;
}

async function logSignInIfNeeded({
  userId,
  ipAddress,
  userAgent,
}: {
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const dedupeWindowMs = 30 * 60 * 1000;
  const since = new Date(Date.now() - dedupeWindowMs);
  const prisma = await getPrisma();

  const recentSignIn = await prisma.activityLog.findFirst({
    where: {
      userId,
      activity: ACTIVITY_TYPES.USER_SIGNED_IN as never,
      createdAt: { gte: since },
    },
    select: { id: true },
    orderBy: { createdAt: "desc" },
  });

  if (recentSignIn) return;

  await logActivity({
    userId,
    activity: ACTIVITY_TYPES.USER_SIGNED_IN,
    description: "User logged in or resumed an authenticated session.",
    ipAddress,
    userAgent,
  });
}

export async function ensureClerkUserSynced({
  clerkUserId,
  ipAddress,
  userAgent,
}: EnsureClerkUserSyncedParams) {
  const prisma = await getPrisma();
  const client = await clerkClient();
  const clerkUser = (await client.users.getUser(clerkUserId)) as MinimalClerkUser;

  const email = pickPrimaryEmail(clerkUser);
  const phone = pickPrimaryPhone(clerkUser);
  const firstname = clerkUser.firstName ?? "";
  const lastname = clerkUser.lastName ?? "";

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  const user = await prisma.user.upsert({
    where: { clerkId: clerkUserId },
    create: {
      clerkId: clerkUserId,
      firstname,
      lastname,
      email,
      phone,
    },
    update: {
      firstname,
      lastname,
      email,
      phone,
    },
  });

  if (!existingUser) {
    await logActivity({
      userId: user.id,
      activity: ACTIVITY_TYPES.USER_REGISTERED,
      description: "User was inserted into application database from Clerk auth.",
      ipAddress,
      userAgent,
    });
  }

  await logSignInIfNeeded({ userId: user.id, ipAddress, userAgent });

  return user;
}
