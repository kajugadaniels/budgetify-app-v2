"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { NAV_CTA, NAV_LINKS } from "@/constants/nav-links";

import {
    List,
    X,
    Wallet,
    ArrowRight,
} from "@phosphor-icons/react";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function isActiveHash(pathname: string, href: string) {
    // Landing page with hash sections (e.g. #features)
    if (!href.startsWith("#")) return false;
    // when you are on "/", treat as active based on current hash
    if (typeof window === "undefined") return false;
    return window.location.hash === href;
}

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 6);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const desktopLinks = useMemo(() => NAV_LINKS, []);

    return (
        <header className="sticky top-0 z-50">
            {/* Glass shell */}
            <div
                className={cx(
                    "mx-auto w-full",
                    "border-b",
                    "bg-background/70 backdrop-blur-xl",
                    "supports-[backdrop-filter]:bg-background/55",
                    scrolled ? "border-border/70 shadow-sm" : "border-border/40"
                )}
            >
                <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
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
                            <span className="text-[11px] text-muted-foreground">
                                Plan ahead with scattered money
                            </span>
                        </span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden items-center gap-1 md:flex">
                        {desktopLinks.map((l) => {
                            const active = isActiveHash(pathname, l.href);
                            return (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    className={cx(
                                        "rounded-2xl px-3 py-2 text-sm transition-colors",
                                        "hover:bg-foreground/[0.04] hover:text-foreground",
                                        active ? "bg-foreground/[0.05] text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {l.label}
                                </a>
                            );
                        })}
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden items-center gap-2 md:flex">
                        <Link href={NAV_CTA.signIn.href}>
                            <Button
                                variant="ghost"
                                className="rounded-2xl border border-transparent bg-transparent hover:border-border/60 hover:bg-foreground/[0.03]"
                            >
                                {NAV_CTA.signIn.label}
                            </Button>
                        </Link>

                        <Link href={NAV_CTA.primary.href}>
                            <Button className="rounded-2xl">
                                {NAV_CTA.primary.label}
                                <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu */}
                    <div className="flex items-center gap-2 md:hidden">
                        <Link href={NAV_CTA.primary.href}>
                            <Button className="rounded-2xl" size="sm">
                                {NAV_CTA.primary.label}
                            </Button>
                        </Link>

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
                                        Budget around your real paydays and priorities.
                                    </p>
                                </SheetHeader>

                                <div className="mt-6 space-y-3">
                                    {desktopLinks.map((l) => (
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
                                                {NAV_CTA.signIn.label}
                                            </Button>
                                        </Link>

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
            </div>
        </header>
    );
}