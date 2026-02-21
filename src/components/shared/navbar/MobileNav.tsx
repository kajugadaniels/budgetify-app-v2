"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCredits } from "@/components/shared/credits/CreditProvider";

import { NAV_CTA, NAV_LINKS } from "@/constants/nav-links";

import { List, Wallet, ArrowRight } from "@phosphor-icons/react";
import ThemeToggle from "../theme/ThemeToggle";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const links = useMemo(() => NAV_LINKS, []);
    const { enabled, credits, getRequiredCredits, attemptAction } = useCredits();
    const signInCredits = getRequiredCredits("signIn");

    const onSignInClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const allowed = attemptAction({
            action: "signIn",
            onAllowed: () => {
                setOpen(false);
            },
        });

        if (!allowed) {
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
        }
    };

    return (
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:hidden">
            {/* Brand */}
            <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 transition-colors hover:bg-foreground/4"
                aria-label="Budgetify home"
            >
                <span className="grid size-9 place-items-center rounded-2xl border border-border/60 bg-foreground/3">
                    <Wallet size={18} weight="duotone" />
                </span>
                <span className="flex flex-col leading-none">
                    <span className="text-sm font-semibold tracking-tight">Budgetify</span>
                    <span className="text-[11px] text-muted-foreground">Plan around paydays</span>
                </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {enabled ? (
                    <div className="inline-flex h-9 items-center gap-1 rounded-2xl border border-border/60 bg-background/60 px-2 text-xs backdrop-blur-xl">
                        <span className="text-muted-foreground">C</span>
                        <span className="font-semibold tabular-nums">{credits}</span>
                    </div>
                ) : null}

                <SignedOut>
                    <SignUpButton
                        mode="modal"
                        forceRedirectUrl="/"
                        fallbackRedirectUrl="/"
                    >
                        <Button size="sm" className="h-9 rounded-2xl px-3">
                            {NAV_CTA.primary.label}
                            <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </SignUpButton>
                </SignedOut>

                <ThemeToggle size={38} iconSize={18} />

                {/* Premium minimal icon button */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-2xl border-border/60 bg-background/60 backdrop-blur-xl hover:bg-foreground/3"
                            aria-label="Open menu"
                        >
                            <List size={18} />
                        </Button>
                    </SheetTrigger>

                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>

                    <SheetContent
                        side="right"
                        className="w-[92vw] rounded-l-3xl sm:w-105"
                    >
                        <SheetHeader className="space-y-4">
                            {/* Top row */}
                            <div className="flex items-center justify-between">
                                <SheetTitle className="flex items-center gap-2">
                                    <span className="grid size-9 place-items-center rounded-2xl border border-border/60 bg-foreground/3">
                                        <Wallet size={18} weight="duotone" />
                                    </span>
                                    <span className="tracking-tight">Budgetify</span>
                                </SheetTitle>
                            </div>

                            {/* Subtle intro card */}
                            <div className="rounded-2xl border border-border/50 bg-foreground/2 p-4">
                                <p className="text-sm font-medium tracking-tight">
                                    Stay ahead of your money.
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    Budget across different salaries and paydays with clarity.
                                </p>
                            </div>
                        </SheetHeader>

                        {/* Links */}
                        <div className="mt-6 p-4">
                            <div className="text-xs font-medium text-muted-foreground">Explore</div>
                            <div className="mt-3 space-y-2">
                                {links.map((l) => (
                                    <a
                                        key={l.href}
                                        href={l.href}
                                        onClick={() => setOpen(false)}
                                        className="group flex items-start justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3 backdrop-blur-xl transition-colors hover:bg-foreground/3"
                                    >
                                        <div>
                                            <div className="text-sm font-medium tracking-tight">{l.label}</div>
                                            {l.description ? (
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {l.description}
                                                </div>
                                            ) : null}
                                        </div>

                                        <span className="mt-0.5 inline-flex size-7 items-center justify-center rounded-xl border border-border/50 bg-foreground/2 text-muted-foreground transition-colors group-hover:text-foreground">
                                            <ArrowRight size={14} />
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Bottom actions */}
                        <SignedOut>
                            <div className="space-y-2 p-4">
                                <SignInButton
                                    mode="modal"
                                    forceRedirectUrl="/"
                                    fallbackRedirectUrl="/"
                                >
                                    <Button
                                        variant="outline"
                                        className="h-11 w-full rounded-2xl border-border/60 bg-background/60"
                                        onClick={onSignInClick}
                                    >
                                        {NAV_CTA.signIn.label}
                                        {enabled ? (
                                            <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                                {signInCredits} credits
                                            </span>
                                        ) : null}
                                    </Button>
                                </SignInButton>

                                <SignUpButton
                                    mode="modal"
                                    forceRedirectUrl="/"
                                    fallbackRedirectUrl="/"
                                >
                                    <Button className="h-11 w-full rounded-2xl">
                                        {NAV_CTA.primary.label}
                                        <ArrowRight size={16} className="ml-2" />
                                    </Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
