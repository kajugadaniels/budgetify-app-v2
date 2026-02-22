"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import TanStackProvider from "@/components/providers/TanStackProvider";
import { ThemeProvider } from "../theme-provider";
import { CreditProvider } from "../shared/credits/CreditProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TanStackProvider>
            <ClerkProvider>
                <ThemeProvider>
                    <CreditProvider>
                        <Toaster position="top-right" richColors closeButton />
                        {children}
                    </CreditProvider>
                </ThemeProvider>
            </ClerkProvider>
        </TanStackProvider>
    );
}