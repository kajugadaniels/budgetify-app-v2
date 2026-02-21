"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCredits } from "@/components/shared/credits/CreditProvider";
import { NAV_CTA, NAV_LINKS } from "@/constants/nav-links";

import { Wallet, ArrowRight } from "@phosphor-icons/react";
import ThemeToggle from "../theme/ThemeToggle";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function isActiveHash(href: string) {
    if (!href.startsWith("#")) return false;
    if (typeof window === "undefined") return false;
    return window.location.hash === href;
}

export default function DesktopNav() {
    const router = useRouter();
    const links = useMemo(() => NAV_LINKS, []);
    const { enabled, credits, getRequiredCredits, attemptAction } = useCredits();

    const signInCredits = getRequiredCredits("signIn");

    const onSignInClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        attemptAction({
            action: "signIn",
            onAllowed: () => router.push(NAV_CTA.signIn.href),
        });
    };

    return (
        <nav className="mx-auto hidden h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:flex">
            {/* Brand */}
            <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full px-4 py-3 transition-colors"
                aria-label="Budgetify home"
            >
                <span className="grid size-9 place-items-center rounded-2xl border border-border/60 bg-foreground/3">
                    <Wallet size={18} weight="duotone" />
                </span>
                <span className="flex flex-col leading-none">
                    <span className="text-sm font-semibold tracking-tight">Budgetify</span>
                    <span className="text-[11px] text-muted-foreground">
                        Plan ahead with scattered money
                    </span>
                </span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-1">
                {links.map((l) => {
                    const active = isActiveHash(l.href);
                    return (
                        <a
                            key={l.href}
                            href={l.href}
                            className={cx(
                                "rounded-2xl px-3 py-2 text-sm transition-colors",
                                "hover:bg-foreground/4 hover:text-foreground",
                                active ? "bg-foreground/5 text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {l.label}
                        </a>
                    );
                })}
            </div>

            <div className="flex items-center gap-2">
                {enabled ? (
                    <div className="inline-flex h-9 items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 text-xs backdrop-blur-xl">
                        <span className="text-muted-foreground">Credits</span>
                        <span className="font-semibold tabular-nums">{credits}</span>
                    </div>
                ) : null}

                <ThemeToggle />

                <Link href={NAV_CTA.signIn.href} onClick={onSignInClick}>
                    <Button
                        variant="ghost"
                        className="rounded-2xl border border-transparent bg-transparent hover:border-border/60 hover:bg-foreground/3"
                    >
                        {NAV_CTA.signIn.label}
                        {enabled ? (
                            <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                {signInCredits} credits
                            </span>
                        ) : null}
                    </Button>
                </Link>

                <Link href={NAV_CTA.primary.href}>
                    <Button className="rounded-2xl">
                        {NAV_CTA.primary.label}
                        <ArrowRight size={16} className="ml-2" />
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
