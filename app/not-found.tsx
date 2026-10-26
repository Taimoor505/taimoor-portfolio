import type { Metadata } from "next";
import Link from "next/link";

// Replaces Next's default 404 (system font, its own inline body colours). Built from the site tokens,
// so it renders in light, OS dark and toggled dark like every other page. Bad case-study slugs land
// here too (dynamicParams = false on /projects/[slug]). Next already adds a noindex robots tag to
// not-found responses, so no robots metadata is set here (it would print a second tag).
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="page-top section-b bg-surface">
      <div className="wrap">
        <p className="meta text-ink-3">Error 404</p>
        <h1 id="nf-title" className="t-h1 mt-3 text-ink">
          Page not found
        </h1>
        <p className="measure t-lead mt-5 text-ink-2">
          The link may be mistyped, or the page has moved. The projects and case studies are all one click away.
        </p>
        <div className="mt-9 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <Link className="btn-label flip flip-accent btn-lg" href="/projects">
            See all projects
          </Link>
          <Link className="btn-label flip flip-outline btn-lg" href="/">
            Home
          </Link>
          <Link className="btn-label text-link inline-flex min-h-11 items-center text-ink sm:ml-2" href="/contact">
            Get in touch<span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
