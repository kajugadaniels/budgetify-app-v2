"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";

import { NAV_CTA, NAV_LINKS } from "@/constants/nav-links";

import {
    IconHome,
    IconInfoCircle,
    IconSparkles,
    IconTag,
    IconHelpCircle,
    IconWallet,
} from "@tabler/icons-react";

type DockItem = {
    title: string;
    icon: React.ReactNode;
    href: string;
};

function iconForHref(href: string) {
    const base = "h-full w-full text-neutral-600 dark:text-neutral-300";
    if (href.includes("how-it-works")) return <IconInfoCircle className={base} />;
    if (href.includes("features")) return <IconSparkles className={base} />;
    if (href.includes("pricing")) return <IconTag className={base} />;
    if (href.includes("faq")) return <IconHelpCircle className={base} />;
    return <IconInfoCircle className={base} />;
}

export default function MobileNav() {
    const dockItems: DockItem[] = useMemo(() => {
        const base = "h-full w-full text-neutral-600 dark:text-neutral-300";

        const fromConstants = NAV_LINKS.map((l) => ({
            title: l.label,
            href: l.href,
            icon: iconForHref(l.href),
        }));

        return [
            { title: "Home", href: "/", icon: <IconHome className={base} /> },
            ...fromConstants,
        ];
    }, []);

    return (
        <>
            {/* Minimal top bar (mobile only) */}
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:hidden">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-2xl px-2 py-1 transition-colors hover:bg-foreground/[0.04]"
                    aria-label="Budgetify home"
                >
                    <span className="grid size-9 place-items-center rounded-2xl border border-border/60 bg-foreground/[0.03]">
                        <IconWallet className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                    </span>
                    <span className="flex flex-col leading-none">
                        <span className="text-sm font-semibold tracking-tight">Budgetify</span>
                        <span className="text-[11px] text-muted-foreground">Plan ahead</span>
                    </span>
                </Link>

                <Link href={NAV_CTA.primary.href}>
                    <Button size="sm" className="rounded-2xl">
                        {NAV_CTA.primary.label}
                    </Button>
                </Link>
            </nav>

            {/* Floating dock (mobile only) — let the component handle positioning */}
            <div className="md:hidden">
                <FloatingDock
                    items={dockItems}
                    // production positioning: fixed bottom center
                    mobileClassName="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-3xl border border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 shadow-sm"
                />
            </div>
        </>
    );
}