import type { Metadata } from "next";
import { ArticlePage, articleMetadata } from "@/components/ArticlePage";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata(slug, "hi");
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticlePage slug={slug} lang="hi" />;
}
