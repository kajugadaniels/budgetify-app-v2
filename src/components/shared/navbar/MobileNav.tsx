"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FloatingDock } from "@/components/ui/floating-dock";

import { NAV_CTA, NAV_LINKS } from "@/constants/nav-links";

import {
    ArrowRight,
    House,
    Info,
    List,
    Tag,
    Wallet,
    X,
    Sparkle,
} from "@phosphor-icons/react";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function MobileNav() {
    const [open, setOpen] = useState(false);

    const links = useMemo(() => NAV_LINKS, []);

    const dockItems = useMemo(
        () => [
            { title: "Home", href: "/", icon: <House size={18} weight="duotone" /> },
            { title: "How it works", href: "#how-it-works", icon: <Info size={18} weight="duotone" /> },
            { title: "Features", href: "#features", icon: <Sparkle size={18} weight="duotone" /> },
            { title: "Pricing", href: "#pricing", icon: <Tag size={18} weight="duotone" /> },
        ],
        []
    );

    return (
        <>
            {/* Top mobile bar (minimal + glass) */}
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:hidden">
                {/* Brand */}
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

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Link href={NAV_CTA.signIn.href}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-2xl border border-transparent hover:border-border/60 hover:bg-foreground/[0.03]"
                        >
                            {NAV_CTA.signIn.label}
                        </Button>
                    </Link>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className={cx(
                                    "rounded-2xl border-border/60",
                                    "bg-background/60 backdrop-blur-xl"
                                )}
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
                                    Budget around your real paydays and priorities.
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
                                    <Link href={NAV_CTA.primary.href} onClick={() => setOpen(false)}>
                                        <Button className="w-full rounded-2xl">
                                            {NAV_CTA.primary.label}
                                            <ArrowRight size={16} className="ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>

            {/* Bottom floating dock (small devices only) */}
            <div className="fixed inset-x-0 bottom-4 z-50 md:hidden">
                <div className="mx-auto flex max-w-6xl justify-center px-4 sm:px-6">
                    <FloatingDock
                        items={dockItems}
                        mobileClassName="rounded-3xl border border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 shadow-sm"
                    />
                </div>
            </div>
        </>
    );
}