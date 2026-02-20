export type NavLink = {
    label: string;
    href: string;
    description?: string;
};

export const NAV_LINKS: NavLink[] = [
    { label: "How it works", href: "#how-it-works", description: "Plan around real paydays" },
    { label: "Features", href: "#features", description: "Smart budgets + reminders" },
    { label: "Pricing", href: "#pricing", description: "Free + premium options" },
    { label: "FAQ", href: "#faq", description: "Quick answers" },
];

export const NAV_CTA = {
    signIn: { label: "Sign in", href: "/auth/login" },
    primary: { label: "Get started", href: "/auth/signup" },
};