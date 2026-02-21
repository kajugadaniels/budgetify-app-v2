import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";

function startOfDay(date: Date) {
  const clone = new Date(date);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function getAdminClerkIds() {
  return (process.env.ADMIN_CLERK_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export async function GET() {
  const prisma = await getPrisma();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminIds = getAdminClerkIds();
  if (!adminIds.includes(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const todayStart = startOfDay(now);
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersToday,
    newUsersLast7d,
    totalActivityLogs,
    signedInToday,
    signedInLast7d,
    signedInLast30d,
    activeUsersLast24h,
    activeUsersLast7d,
    activityBreakdown,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: last7d } } }),
    prisma.activityLog.count(),
    prisma.activityLog.count({
      where: {
        activity: "USER_SIGNED_IN",
        createdAt: { gte: todayStart },
      },
    }),
    prisma.activityLog.count({
      where: {
        activity: "USER_SIGNED_IN",
        createdAt: { gte: last7d },
      },
    }),
    prisma.activityLog.count({
      where: {
        activity: "USER_SIGNED_IN",
        createdAt: { gte: last30d },
      },
    }),
    prisma.activityLog.findMany({
      where: { createdAt: { gte: last24h } },
      distinct: ["userId"],
      select: { userId: true },
    }),
    prisma.activityLog.findMany({
      where: { createdAt: { gte: last7d } },
      distinct: ["userId"],
      select: { userId: true },
    }),
    prisma.activityLog.groupBy({
      by: ["activity"],
      _count: { activity: true },
      orderBy: { _count: { activity: "desc" } },
    }),
  ]);

  return NextResponse.json({
    summary: {
      totalUsers,
      newUsersToday,
      newUsersLast7d,
      totalActivityLogs,
      activeUsersLast24h: activeUsersLast24h.length,
      activeUsersLast7d: activeUsersLast7d.length,
      signedInToday,
      signedInLast7d,
      signedInLast30d,
    },
    activityBreakdown: activityBreakdown.map((item) => ({
      activity: item.activity,
      count: item._count.activity,
    })),
  });
}
