import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning className={`${dmSans.variable} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
