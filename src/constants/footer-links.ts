export type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
};

export type FooterSection = {
    title: string;
    links: FooterLink[];
};

export const FOOTER_SECTIONS: FooterSection[] = [
    {
        title: "Product",
        links: [
            { label: "How it works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Updates", href: "/updates" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "/legal/privacy" },
            { label: "Terms of Service", href: "/legal/terms" },
            { label: "Cookie Policy", href: "/legal/cookies" },
        ],
    },
];

export const FOOTER_SOCIALS: FooterLink[] = [
    { label: "X (Twitter)", href: "https://x.com/", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/", external: true },
    { label: "GitHub", href: "https://github.com/", external: true },
];

export const FOOTER_META = {
    brand: "Budgetify",
    tagline: "Plan ahead with scattered money.",
    copyright: (year: number) => `© ${year} Budgetify. All rights reserved.`,
};