import { getPrisma } from "@/lib/prisma";

export const ACTIVITY_TYPES = {
  USER_REGISTERED: "USER_REGISTERED",
  USER_SIGNED_IN: "USER_SIGNED_IN",
  USER_UPDATED: "USER_UPDATED",
} as const;

type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];

type LogActivityParams = {
  userId: string;
  activity: ActivityType;
  description?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function logActivity({
  userId,
  activity,
  description,
  metadata,
  ipAddress,
  userAgent,
}: LogActivityParams) {
  const prisma = await getPrisma();

  await prisma.activityLog.create({
    data: {
      userId,
      activity: activity as never,
      description,
      metadata,
      ipAddress: ipAddress ?? undefined,
      userAgent: userAgent ?? undefined,
    },
  });
}
