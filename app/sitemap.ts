import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { listArticles } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/insights", "/books", "/learn", "/speaking", "/consult", "/exclusive", "/media", "/contact"].map((p) => ({ url: SITE.url + p }));
  const articles = await listArticles({ limit: 500 });
  const entries = articles.flatMap((a) =>
    a.langs.map((l) => ({
      url: `${SITE.url}/insights/${a.slug}${l === "hi" ? "/hi" : ""}`,
      lastModified: new Date(a.updated_at || a.published_at),
    })),
  );
  return [...pages, ...entries];
}
