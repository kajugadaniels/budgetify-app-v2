"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

type Props = {
  className?: string;
  size?: number;
  iconSize?: number;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AnimatedThemeToggler({
  className,
  size = 40,
  iconSize = 18,
}: Props) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const effective = (theme === "system" ? resolvedTheme : theme) ?? "light";
  const isDark = effective === "dark";

  const toggle = React.useCallback(() => {
    const next = isDark ? "light" : "dark";

    // Premium animation where supported (View Transitions API)
    const anyDoc = document as any;
    if (typeof anyDoc?.startViewTransition === "function") {
      anyDoc.startViewTransition(() => {
        setTheme(next);
      });
      return;
    }

    setTheme(next);
  }, [isDark, setTheme]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cx(
        "relative inline-flex items-center justify-center",
        "rounded-2xl border border-border/60",
        "bg-background/60 backdrop-blur-xl",
        "transition-colors hover:bg-foreground/[0.04]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      style={{ width: size, height: size }}
    >
      <span className="relative grid place-items-center">
        {isDark ? (
          <Moon size={iconSize} weight="duotone" />
        ) : (
          <Sun size={iconSize} weight="duotone" />
        )}
      </span>

      {/* subtle inner sheen (no gradients) */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-foreground/[0.03]" />
    </button>
  );
}