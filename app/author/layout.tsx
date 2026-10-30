import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Author dashboard" },
  robots: { index: false, follow: false },
};

export default function AuthorLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[70vh] bg-paper">{children}</div>;
}
