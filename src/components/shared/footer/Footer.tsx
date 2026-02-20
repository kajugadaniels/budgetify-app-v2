"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { FOOTER_META, FOOTER_SECTIONS, FOOTER_SOCIALS } from "@/constants/footer-links";

import { EnvelopeSimple, ArrowRight, Wallet, GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function isExternal(href: string) {
    return /^https?:\/\//.test(href);
}

export default function Footer() {
    const sections = useMemo(() => FOOTER_SECTIONS, []);
    const socials = useMemo(() => FOOTER_SOCIALS, []);
    const year = new Date().getFullYear();

    const [email, setEmail] = useState("");

    const socialIcon = (label: string) => {
        const low = label.toLowerCase();
        if (low.includes("github")) return <GithubLogo size={18} weight="duotone" />;
        if (low.includes("linkedin")) return <LinkedinLogo size={18} weight="duotone" />;
        if (low.includes("x") || low.includes("twitter")) return <XLogo size={18} weight="duotone" />;
        return <ArrowRight size={18} />;
    };

    return (
        <footer className="mt-16 border-t border-border/50 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/55">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                {/* Top grid */}
                <div className="grid gap-10 lg:grid-cols-12">
                    {/* Brand block */}
                    <div className="lg:col-span-4">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 transition-colors"
                            aria-label="Budgetify home"
                        >
                            <span className="grid size-10 place-items-center rounded-2xl border border-border/60 bg-foreground/3">
                                <Wallet size={18} weight="duotone" />
                            </span>
                            <div className="leading-tight">
                                <div className="text-sm font-semibold tracking-tight">{FOOTER_META.brand}</div>
                                <div className="text-xs text-muted-foreground">{FOOTER_META.tagline}</div>
                            </div>
                        </Link>

                        {/* Newsletter (UI-only; wire later) */}
                        <div className="mt-5 rounded-3xl border border-border/60 bg-foreground/2 p-4">
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 grid size-9 place-items-center rounded-2xl border border-border/60 bg-background/60">
                                    <EnvelopeSimple size={18} weight="duotone" />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-sm font-medium">Get budgeting tips</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Occasional updates on planning with mixed paydays.
                                    </p>

                                    <div className="mt-3 flex gap-2">
                                        <Input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email address"
                                            className="h-10 rounded-2xl bg-background/60"
                                            inputMode="email"
                                        />
                                        <Button className="h-10 rounded-2xl" type="button">
                                            Subscribe
                                            <ArrowRight size={16} className="ml-2" />
                                        </Button>
                                    </div>

                                    <p className="mt-2 text-[11px] text-muted-foreground">
                                        No spam. Unsubscribe anytime.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-sm font-semibold">{section.title}</h3>
                                <ul className="mt-4 space-y-2">
                                    {section.links.map((l) => {
                                        const external = l.external ?? isExternal(l.href);
                                        const Comp: any = l.href.startsWith("#") ? "a" : Link;
                                        const props = l.href.startsWith("#")
                                            ? { href: l.href }
                                            : { href: l.href };

                                        return (
                                            <li key={`${section.title}-${l.href}`}>
                                                <Comp
                                                    {...props}
                                                    {...(external
                                                        ? { target: "_blank", rel: "noreferrer" }
                                                        : null)}
                                                    className={cx(
                                                        "inline-flex items-center rounded-xl px-2 py-1 text-sm text-muted-foreground transition-colors",
                                                        "hover:bg-foreground/4 hover:text-foreground"
                                                    )}
                                                >
                                                    {l.label}
                                                </Comp>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="my-10" />

                {/* Bottom row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">{FOOTER_META.copyright(year)}</p>

                    <div className="flex flex-wrap items-center gap-2">
                        {socials.map((s) => {
                            const external = s.external ?? true;
                            return (
                                <Link
                                    key={s.href}
                                    href={s.href}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noreferrer" : undefined}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground backdrop-blur-xl transition-colors hover:bg-foreground/4 hover:text-foreground"
                                    aria-label={s.label}
                                >
                                    {socialIcon(s.label)}
                                    <span>{s.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}