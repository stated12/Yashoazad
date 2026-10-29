import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { listArticles } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/insights", "/books", "/learn", "/speaking", "/consult", "/exclusive", "/media", "/contact"].map((p) => ({ url: SITE.url + p }));
  const articles = await listArticles({ limit: 500 });
  return [...pages, ...articles.map((a) => ({ url: `${SITE.url}/insights/${a.slug}`, lastModified: new Date(a.published_at) }))];
}
