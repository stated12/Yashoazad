export const SITE = {
  name: "Yashovardhan Jha Azad",
  short: "Yashovardhan Azad",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yashoazad.in",
  tagline: "IPS (Retd.) · Former Special Director, Intelligence Bureau · Former Central Information Commissioner",
};

export const NAV = [
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/books", label: "Book" },
  { href: "/learn", label: "Students & Learning" },
  { href: "/speaking", label: "Speaking" },
  { href: "/consult", label: "Consult" },
  { href: "/contact", label: "Contact" },
];

export const TOPICS = [
  "National Security & Strategic Affairs",
  "Intelligence & Counter-Terrorism",
  "Policing & Public Trust",
  "Governance & RTI",
  "Leadership & Ethics",
  "Media & Public Conversations",
];

// External profiles shown in the footer. Order is the display order.
export const SOCIALS = [
  { id: "x", label: "Yashovardhan Azad on X (opens in a new tab)", url: "https://x.com/yashoazad" },
  { id: "linkedin", label: "Yashovardhan Jha Azad on LinkedIn (opens in a new tab)", url: "https://www.linkedin.com/in/yashovardhan-jha-azad" },
  { id: "instagram", label: "Yashovardhan Azad on Instagram (opens in a new tab)", url: "https://www.instagram.com/yashovardhanazad" },
  { id: "facebook", label: "Yashovardhan Azad on Facebook (opens in a new tab)", url: "https://www.facebook.com/share/19jg9pd5YP/" },
] as const;

export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/refunds", label: "Refund & Cancellation" },
];
