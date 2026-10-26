import { releases } from "@/lib/data";

// Site navigation, shared by the header, the mobile menu and the footer.
export const navLinks = [
  { label: "Projects", path: "/projects" },
  { label: "Experience", path: "/experience" },
  { label: "Contact", path: "/contact" },
];

// The nav item for this path, or undefined. Only routes that exist count, so a 404 such as
// /projects/nope does not mark "Projects" as the current page while the H1 says "Page not found".
const caseStudyPaths = new Set(releases.map((r) => `/projects/${r.slug}`));
export function activeNav(pathname: string): { path: string; exact: boolean } | undefined {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (navLinks.some((l) => l.path === path)) return { path, exact: true };
  if (caseStudyPaths.has(path)) return { path: "/projects", exact: false };
  return undefined;
}
export function activeNavPath(pathname: string) {
  return activeNav(pathname)?.path;
}

// aria-current for a nav link: "page" only when the link is this exact page. On a case study the
// Projects link is the section you are in, not the page, so it gets "true" (announced as "current").
export function navCurrent(linkPath: string, pathname: string): "page" | "true" | undefined {
  const a = activeNav(pathname);
  if (!a || a.path !== linkPath) return undefined;
  return a.exact ? "page" : "true";
}
