import type { Metadata } from "next";

// Live site address. Change this if you add a custom domain.
export const SITE_URL = "https://taimoor-portfolio-six.vercel.app";
export const SITE_NAME = "Taimoor Asif";

export function pageMeta(o: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const home = o.path === "/";
  return {
    title: home ? { absolute: o.title } : o.title,
    description: o.description,
    alternates: { canonical: o.path },
    openGraph: {
      type: o.type ?? "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: o.path,
      title: home ? o.title : `${o.title} · ${SITE_NAME}`,
      description: o.description,
    },
    twitter: { card: "summary_large_image" },
  };
}
