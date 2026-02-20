"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";

import { NAV_CTA, NAV_LINKS } from "@/constants/nav-links";

import {
    House,
    Info,
    Sparkle,
    Tag,
    Question,
    Wallet,
} from "@phosphor-icons/react";

type DockItem = {
    title: string;
    href: string;
    icon: React.ReactNode;
};

function iconForHref(href: string) {
    if (href.includes("how-it-works")) return <Info size={18} weight="duotone" />;
    if (href.includes("features")) return <Sparkle size={18} weight="duotone" />;
    if (href.includes("pricing")) return <Tag size={18} weight="duotone" />;
    if (href.includes("faq")) return <Question size={18} weight="duotone" />;
    return <Info size={18} weight="duotone" />;
}

export default function MobileNav() {
    const dockItems: DockItem[] = useMemo(() => {
        const fromConstants = NAV_LINKS.map((l) => ({
            title: l.label,
            href: l.href,
            icon: iconForHref(l.href),
        }));

        // Keep it compact: Home + constants
        return [
            { title: "Home", href: "/", icon: <House size={18} weight="duotone" /> },
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
                        <Wallet size={18} weight="duotone" />
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

            {/* Always-visible floating dock (mobile only) */}
            <div className="fixed inset-x-0 bottom-4 z-50 md:hidden">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="flex justify-center">
                        <FloatingDock
                            items={dockItems}
                            mobileClassName="rounded-3xl border border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}