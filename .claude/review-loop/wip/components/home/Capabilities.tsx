import Link from "next/link";
import Stack from "@/components/shared/Stack";
import { practice, profile, wingCount, wingName } from "@/lib/data";

// Four areas, each with what it means, the tools, and a link to the matching projects.
export default function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="px-2 md:px-4">
      <div className="sheet section bg-surface-sunken">
        <div className="wrap-inset">
          <div className="grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-x-10">
            <h2 id="capabilities-title" className="t-h2 text-ink md:col-span-5">
              What I build
            </h2>
            <p className="measure text-ink-2 md:col-span-7 md:pt-2">{profile.intro}</p>
          </div>
          <ul className="mt-10 grid grid-cols-1 border-t border-line-strong md:mt-14 md:grid-cols-2">
            {practice.map((g, i) => {
              const count = wingCount(g.wing);
              const title = wingName(g.wing);
              return (
                <li
                  key={g.wing}
                  className={`flex flex-col border-b border-line py-5 sm:py-7 md:py-9 ${i % 2 === 0 ? "md:pr-10" : "md:border-l md:pl-10"}`}
                >
                  <h3 className="t-h3 text-ink">{title}</h3>
                  {/* Below 640px each area is its heading, tools and link; the sentence is left to wider
                      screens so the section stays about one phone screen. */}
                  <p className="measure mt-3 text-ink-2 max-sm:hidden">{g.text}</p>
                  <Stack items={g.tags} className="mt-3 text-ink-3 sm:mt-4" />
                  <p className="mt-2 sm:mt-5 md:mt-auto md:pt-5">
                    <Link className="text-link nav-label inline-flex min-h-11 items-center text-ink" href={`/projects?wing=${g.wing}`}>
                      See {count} {count === 1 ? "project" : "projects"}
                      <span aria-hidden="true">&nbsp;→</span>
                      <span className="sr-only"> in {title}</span>
                    </Link>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
