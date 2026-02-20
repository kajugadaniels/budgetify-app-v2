"use client";

import { useEffect, useState } from "react";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 6);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className="sticky top-0 z-50">
            <div
                className={cx(
                    "mx-auto w-full border-b",
                    "bg-background/70 backdrop-blur-xl",
                    "supports-backdrop-filter:bg-background/55",
                    scrolled ? "border-border/70 shadow-sm" : "border-border/40"
                )}
            >
                <DesktopNav />
                <MobileNav />
            </div>
        </header>
    );
}