import Link from "next/link";
import FlowScreen from "@/components/shared/FlowScreen";
import TranscriptScreen from "@/components/shared/TranscriptScreen";
import { featuredSlug, getRelease, profile, releases } from "@/lib/data";

export default function Hero() {
  const featured = getRelease(featuredSlug) ?? releases[0];

  return (
    <section className="relative bg-paper pt-20 md:pt-24" data-spine={`${featured.version} · ${featured.name}`}>
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col gap-4 border-b border-line-strong pb-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <h1 className="mast mast-settle text-ink" style={{ fontSize: "clamp(2.3rem, 1.3rem + 4.2vw, 4.8rem)" }}>
            {profile.name}
            <span className="text-violet">.</span>
          </h1>
          <div className="rise-in md:pb-2 md:text-right" style={{ animationDelay: "200ms" }}>
            <p className="tag-lg text-ink">{profile.currently}</p>
            <p className="tag mt-1.5 flex items-center gap-2.5 text-ink-2 md:justify-end">
              <span className="lamp" aria-hidden="true"></span>
              v2.0 · {releases.length} releases · {profile.location}
            </p>
          </div>
        </div>

        <article className="rise-in mt-8 md:mt-10" style={{ animationDelay: "350ms" }}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
            <div className="flex flex-col md:col-span-4">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="tag-lg text-violet">{featured.version}</span>
                <span className="tag text-ink-2">{featured.date}</span>
                <span className="tag text-ink-3">{featured.kind}</span>
              </div>
              <h2
                className="display-1 mt-4 break-words text-balance text-ink"
                style={{ fontSize: "clamp(1.8rem, 1.05rem + 2.3vw, 3.3rem)" }}
              >
                {featured.name}
              </h2>
              <p className="measure mt-4 text-ink-2">{featured.tagline}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-auto md:pt-8">
                <Link className="btn-label flip flip-violet px-7 py-4" href={`/projects/${featured.slug}`}>
                  Open this release
                </Link>
                <Link className="btn-label flip flip-outline px-7 py-4" href="/projects">
                  Full index · {releases.length}
                </Link>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="mount relative aspect-[16/9]">
                <div
                  className="absolute -right-[6%] -top-[2%] w-[74%] opacity-90 blur-[1.5px]"
                  aria-hidden="true"
                  style={{ transform: "translateY(6%)" }}
                >
                  <div className="block aspect-[16/9] w-full overflow-hidden rounded-lg border border-line-night">
                    {featured.transcript?.length ? (
                      <TranscriptScreen release={featured} />
                    ) : (
                      <FlowScreen release={featured} variant="sm" />
                    )}
                  </div>
                </div>
                <div
                  className="absolute bottom-[5%] left-[3%] w-[76%] shadow-[0_24px_48px_-24px_rgba(20,12,40,0.55)]"
                >
                  <div className="block aspect-[16/9] w-full overflow-hidden rounded-lg border border-line-night">
                    <FlowScreen release={featured} variant="lg" />
                  </div>
                </div>
              </div>
              <p className="tag mt-3 flex flex-wrap gap-x-5 gap-y-1 text-ink-3">
                {featured.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
