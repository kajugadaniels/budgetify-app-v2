"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

type Props = {
    className?: string;
    size?: number;
    iconSize?: number;
};

export default function ThemeToggle(props: Props) {
    return <AnimatedThemeToggler {...props} />;
}