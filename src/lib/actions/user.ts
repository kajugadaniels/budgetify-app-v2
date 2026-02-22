"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { ACTIVITY_TYPES } from "../activity-log";

export async function syncUser() {
    try {
        const user = await currentUser();
        if (!user) return;

        const email =
            user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;
        const phone =
            user.primaryPhoneNumber?.phoneNumber ?? user.phoneNumbers[0]?.phoneNumber ?? null;
        const firstname = user.firstName ?? "";
        const lastname = user.lastName ?? "";

        const existingUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
            select: { id: true },
        });

        const dbUser = await prisma.user.upsert({
            where: { clerkId: user.id },
            update: {
                firstname,
                lastname,
                email,
                phone,
            },
            create: {
                clerkId: user.id,
                firstname,
                lastname,
                email,
                phone,
            },
        });

        const shouldLogSignIn = existingUser
            ? !(await prisma.activityLog.findFirst({
                  where: {
                      userId: existingUser.id,
                      activity: ACTIVITY_TYPES.USER_SIGNED_IN as never,
                      createdAt: {
                          gte: new Date(Date.now() - 30 * 60 * 1000),
                      },
                  },
                  select: { id: true },
              }))
            : false;

        if (!existingUser || shouldLogSignIn) {
            await prisma.activityLog.create({
                data: {
                    userId: dbUser.id,
                    activity: (existingUser
                        ? ACTIVITY_TYPES.USER_SIGNED_IN
                        : ACTIVITY_TYPES.USER_REGISTERED) as never,
                    description: existingUser
                        ? "User authenticated and profile was verified in application database."
                        : "User registered and was inserted into application database.",
                    metadata: {
                        clerkId: user.id,
                        source: "user-sync-server-action",
                    },
                },
            });
        }

        return dbUser;
    } catch (error) {
        console.error("Error in syncUser server action", error);
        throw error;
    }
}
