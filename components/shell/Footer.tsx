import Link from "next/link";
import { profile } from "@/lib/data";
import LocalTime from "./LocalTime";

const links = [
  { label: "Index", path: "/projects" },
  { label: "Experience", path: "/experience" },
  { label: "Contact", path: "/contact" },
];

const linkCls = "tag text-on-night-2 transition-colors hover:text-on-night";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer role="contentinfo" className="on-dark bg-night">
      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-10 md:py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="tag text-on-night-3">Reach the maintainer</p>
            <a
              href={`mailto:${profile.email}`}
              className="display-2 mt-3 inline-block break-all text-on-night underline decoration-violet-bright decoration-2 underline-offset-8 transition-colors hover:text-violet-bright"
            >
              {profile.email}
            </a>
            <p className="tag mt-4 text-on-night-2">
              {profile.locationLong} · <LocalTime />
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {links.map((l) => (
                  <li key={l.path}>
                    <Link className={linkCls} href={l.path}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className={linkCls}>
              GitHub <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>
              LinkedIn <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={linkCls}>
              Resume <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line-night pt-6">
          <p className="tag text-on-night-3">
            © {year} {profile.name}
          </p>
          <p className="tag text-on-night-3">Portfolio v2.0.0 · built with Next.js · shipped from Lahore</p>
        </div>
      </div>
    </footer>
  );
}
