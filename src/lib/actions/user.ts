"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getPrisma } from "../prisma";

export async function syncUser() {
    try {
        const prisma = await getPrisma();
        const user = await currentUser();
        if (!user) return;

        const existingUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });
        if (existingUser) return existingUser;

        const dbUser = await prisma.user.create({
            data: {
                clerkId: user.id,
                firstname: user.firstName ?? "",
                lastname: user.lastName ?? "",
                email: user.emailAddresses[0]?.emailAddress ?? null,
                phone: user.phoneNumbers[0]?.phoneNumber,
            },
        });

        return dbUser;
    } catch (error) {
        console.log("Error in syncUser server action", error);
    }
}
