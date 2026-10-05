import Link from "next/link";
import { practice, profile, releases, roles } from "@/lib/data";

export default function Practice() {
  const currentOrg = roles.find((r) => r.current)?.org ?? "";
  const stats: [string, string | number][] = [
    ["Writing code since", profile.startedYear],
    ["Releases shipped", releases.length],
    ["Based in", profile.location],
    ["Currently at", currentOrg],
  ];

  return (
    <section id="practice" className="mx-2 md:mx-4">
      <div className="sheet bg-paper-deep py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-4">
              <h2 className="display-1 text-ink">What I work in</h2>
              <p className="measure mt-4 text-ink-2">{profile.intro}</p>
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line-strong pt-7">
                {stats.map(([label, value]) => (
                  <div key={label}>
                    <dt className="tag text-ink-3">{label}</dt>
                    <dd className="display-2 mt-1.5 text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <Link className="btn-label flip flip-solid mt-10 inline-block px-7 py-4" href="/experience">
                The professional record
              </Link>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <dl>
                {practice.map((g) => (
                  <div
                    key={g.title}
                    className="grid grid-cols-1 gap-x-8 border-t border-line py-7 first:border-t-0 first:pt-0 sm:grid-cols-[11rem_1fr] md:py-8"
                  >
                    <dt className="tag-lg text-violet">{g.title}</dt>
                    <dd>
                      <p className="measure text-ink">{g.text}</p>
                      <p className="tag mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-ink-3">
                        {g.tags.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
