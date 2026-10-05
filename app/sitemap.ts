import type { MetadataRoute } from "next";
import { releases } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/experience", "/contact"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const rel = releases.map((r) => ({
    url: `${SITE_URL}/projects/${r.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...pages, ...rel];
}
