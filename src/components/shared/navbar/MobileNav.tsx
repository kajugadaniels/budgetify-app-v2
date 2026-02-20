"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// Added by: npx shadcn@latest add @aceternity/floating-dock
import { FloatingDock } from "@/components/ui/floating-dock";

import { NAV_CTA, NAV_LINKS } from "@/constants/nav-links";

import {
    List,
    X,
    Wallet,
    House,
    Sparkle,
    Tag,
    Question,
    RocketLaunch,
    SignIn,
} from "@phosphor-icons/react";

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const links = useMemo(() => NAV_LINKS, []);

    const dockItems = useMemo(
        () => [
            { title: "Home", icon: <House size={18} weight="duotone" />, href: "/" },
            { title: "How it works", icon: <Sparkle size={18} weight="duotone" />, href: "#how-it-works" },
            { title: "Pricing", icon: <Tag size={18} weight="duotone" />, href: "#pricing" },
            { title: "FAQ", icon: <Question size={18} weight="duotone" />, href: "#faq" },
            { title: "Get started", icon: <RocketLaunch size={18} weight="duotone" />, href: NAV_CTA.primary.href },
        ],
        []
    );

    return (
        <>
            {/* Minimal top bar */}
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:hidden">
                {/* Brand */}
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 transition-colors hover:bg-foreground/[0.04]"
                    aria-label="Budgetify home"
                >
                    <span className="grid size-9 place-items-center rounded-2xl border border-border/60 bg-foreground/[0.03]">
                        <Wallet size={18} weight="duotone" />
                    </span>
                    <span className="flex flex-col leading-none">
                        <span className="text-sm font-semibold tracking-tight">Budgetify</span>
                        <span className="text-[11px] text-muted-foreground">Plan around real paydays</span>
                    </span>
                </Link>

                {/* Menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-2xl border-border/60 bg-background/60 backdrop-blur-xl"
                            aria-label="Open menu"
                        >
                            <List size={18} />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[92vw] rounded-l-3xl sm:w-[420px]">
                        <SheetHeader className="space-y-3">
                            <div className="flex items-center justify-between">
                                <SheetTitle className="flex items-center gap-2">
                                    <span className="grid size-9 place-items-center rounded-2xl border border-border/60 bg-foreground/[0.03]">
                                        <Wallet size={18} weight="duotone" />
                                    </span>
                                    Budgetify
                                </SheetTitle>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-2xl"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X size={18} />
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Minimal planning. Maximum clarity.
                            </p>
                        </SheetHeader>

                        <div className="mt-6 space-y-3">
                            {links.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-2xl border border-border/50 bg-foreground/[0.02] px-4 py-3 transition-colors hover:bg-foreground/[0.04]"
                                >
                                    <div className="text-sm font-medium">{l.label}</div>
                                    {l.description ? (
                                        <div className="mt-1 text-xs text-muted-foreground">{l.description}</div>
                                    ) : null}
                                </a>
                            ))}

                            <Separator className="my-4" />

                            <div className="grid gap-2">
                                <Link href={NAV_CTA.signIn.href} onClick={() => setOpen(false)}>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-2xl border-border/60 bg-background/60"
                                    >
                                        <SignIn size={16} className="mr-2" />
                                        {NAV_CTA.signIn.label}
                                    </Button>
                                </Link>

                                <Link href={NAV_CTA.primary.href} onClick={() => setOpen(false)}>
                                    <Button className="w-full rounded-2xl">
                                        {NAV_CTA.primary.label}
                                        <RocketLaunch size={16} className="ml-2" weight="duotone" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>

            {/* Floating Dock (mobile only) */}
            <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 md:hidden">
                <div className="pointer-events-auto mx-auto flex max-w-6xl justify-center px-4 sm:px-6">
                    <FloatingDock
                        items={dockItems}
                        desktopClassName="hidden"
                        mobileClassName="rounded-3xl border border-border/60 bg-background/70 backdrop-blur-xl shadow-sm"
                    />
                </div>
            </div>
        </>
    );
}