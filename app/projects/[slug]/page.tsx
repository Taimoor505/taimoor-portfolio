import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { releases, getRelease } from "@/lib/data";
import { pageMeta } from "@/lib/site";
import FlowScreen from "@/components/shared/FlowScreen";
import FormatOutcome from "@/components/shared/FormatOutcome";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return releases.map((r) => ({ slug: r.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = getRelease(slug);
  if (!r) return { title: "Project not found" };
  return pageMeta({
    title: `${r.name} · Case Study`,
    description: [
      `${r.tagline}.`,
      r.result && r.result.value !== "Shipped" ? `Result: ${r.result.value} ${r.result.label}.` : "",
      `Built with ${r.stack.slice(0, 4).join(", ")}.`,
    ]
      .filter(Boolean)
      .join(" "),
    path: `/projects/${r.slug}`,
    image: `/projects/${r.slug}/opengraph-image`,
    type: "article",
  });
}

export default async function ReleasePage({ params }: Props) {
  const { slug } = await params;
  const release = getRelease(slug);
  if (!release) notFound();

  const i = releases.findIndex((r) => r.slug === release.slug);
  const earlier = releases[i + 1];
  const later = i > 0 ? releases[i - 1] : undefined;

  const hasMetric = release.result && release.result.value !== "Shipped";

  return (
    <article className="bg-paper pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Link href="/projects" className="font-mono text-xs font-semibold text-ink-2 hover:text-violet">
          ← All projects
        </Link>

        {/* Header Section */}
        <header className="mt-8 md:mt-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
            <span className="font-semibold uppercase tracking-wider text-violet">{release.kind}</span>
            <span className="text-ink-3/40">/</span>
            <span className="text-ink-2">{release.dateLong}</span>
            <span className="text-ink-3/40">/</span>
            <span className="text-ink-3">{release.context}</span>
            {release.status && (
              <span className="rounded-full border border-violet/40 bg-violet/10 px-2.5 py-0.5 text-[11px] font-medium text-violet">
                {release.status}
              </span>
            )}
          </div>

          <h1 className="mast mt-4 break-words text-ink" style={{ fontSize: "clamp(2.4rem, 1.2rem + 5vw, 5.5rem)" }}>
            {release.name}
          </h1>
          <p className="measure mt-5 text-xl leading-relaxed text-ink-2">{release.tagline}</p>

          {/* Verified Outcome Banner */}
          {hasMetric && (
            <div className="mt-8 inline-flex flex-col rounded-xl border border-line-strong bg-paper-deep/60 px-6 py-4">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                Verified Production Outcome
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-mono text-3xl font-bold tracking-tight text-violet md:text-4xl">
                  <FormatOutcome value={release.result!.value} />
                </span>
                <span className="text-base font-medium text-ink">{release.result!.label}</span>
              </div>
            </div>
          )}
        </header>

        {/* System Architecture Diagram */}
        <div className="mt-12 md:mt-16">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-3">
              System Architecture Flow
            </span>
            <span className="font-mono text-xs text-ink-3">
              {release.flow.length} Steps / Trigger to Execution
            </span>
          </div>
          <div className="mount relative aspect-[16/9] md:hidden">
            <FlowScreen release={release} variant="sm" />
          </div>
          <div className="mount relative hidden aspect-[16/9] md:block">
            <FlowScreen release={release} variant="lg" />
          </div>
        </div>

        {/* Illustrative Call Transcript (if present, with clear non-conflicting disclaimer) */}
        {release.transcript && release.transcript.length > 0 && (
          <div className="mt-14 rounded-2xl border border-line-night bg-night p-6 text-on-night md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-night pb-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-violet-bright">
                Illustrative Voice Agent Conversation
              </span>
              <span className="font-mono text-[11px] text-on-night-3">
                Simulated dialogue for demonstration / Real client calls are confidential
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {release.transcript.map((line, idx) => (
                <div key={idx} className="flex gap-4 text-sm leading-relaxed">
                  <span className="w-16 shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-violet-bright">
                    {line.who}:
                  </span>
                  <span className={line.who === "agent" ? "text-on-night-2" : "text-on-night"}>
                    &quot;{line.text}&quot;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Engineering Case Study Breakdown */}
        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-line-strong pt-12 md:mt-24 md:grid-cols-12 md:gap-10">
          {/* Left Column: What Shipped & Stack */}
          <div className="md:col-span-5">
            <h2 className="display-2 text-ink">What shipped</h2>
            <ul className="mt-6 border-t border-line-strong">
              {release.shipped.map((s) => (
                <li key={s} className="diff-add border-b border-line py-3.5 text-sm leading-relaxed text-ink">
                  {s}
                </li>
              ))}
            </ul>

            <h2 className="display-2 mt-12 text-ink">Built with</h2>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-line-strong pt-5">
              {release.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-line-strong bg-paper-deep/60 px-3 py-1 font-mono text-xs font-medium text-ink-2"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Depth & Problem Statement */}
          <div className="space-y-8 md:col-span-7">
            <div>
              <h2 className="display-2 text-ink">The operational bottleneck</h2>
              <p className="measure mt-4 leading-relaxed text-ink-2">{release.about}</p>
            </div>

            <div className="rounded-xl border border-line-strong bg-paper-deep/40 p-6">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                Engineering &amp; Reliability Safeguards
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-2">
                <li><strong>Idempotency and Deduplication:</strong> Automated locks and dedupe keys prevent duplicate dials or redundant database writes.</li>
                <li><strong>Failure Isolation:</strong> Non-blocking webhook retries with alerting fallback ensure zero missed customer events.</li>
                <li><strong>Human-in-the-Loop Handoff:</strong> Explicit escalation triggers route complex inquiries to team members with complete context.</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link className="btn-label flip flip-violet px-7 py-3.5" href="/contact">
                Discuss a similar build
              </Link>
              <Link className="btn-label flip flip-outline px-7 py-3.5" href="/projects">
                Back to all projects
              </Link>
            </div>
          </div>
        </div>

        {/* Adjacent Project Navigation */}
        <nav
          aria-label="Adjacent projects"
          className="mt-20 grid grid-cols-1 gap-4 border-t border-line-strong pt-8 sm:grid-cols-2 md:mt-28"
        >
          {earlier ? (
            <Link href={`/projects/${earlier.slug}`} className="group block">
              <span className="font-mono text-xs text-ink-3">← Earlier project</span>
              <span className="display-2 mt-1 block text-ink transition-colors group-hover:text-violet">
                {earlier.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {later ? (
            <Link href={`/projects/${later.slug}`} className="group block sm:text-right">
              <span className="font-mono text-xs text-ink-3">Next project →</span>
              <span className="display-2 mt-1 block text-ink transition-colors group-hover:text-violet">
                {later.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </article>
  );
}
