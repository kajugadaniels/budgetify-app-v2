import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { DM_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Budgetify",
    description: "Plan ahead with you scattered money",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();
    if (userId) {
        try {
            const requestHeaders = await headers();
            const ipAddress = requestHeaders.get("x-forwarded-for");
            const userAgent = requestHeaders.get("user-agent");

            await ensureClerkUserSynced({
                clerkUserId: userId,
                ipAddress,
                userAgent,
            });
        } catch (error) {
            console.error("Failed to sync Clerk user into database", error);
        }
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning className={`${dmSans.variable} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
