import Link from "next/link";
import FlowSteps from "@/components/shared/FlowSteps";
import Stack from "@/components/shared/Stack";
import "@/components/shared/shared.css";
import { getRelease, isMeasured, outcome, projectCountLine, projectStats, selectedSlugs, type Release } from "@/lib/data";

// Outcome-first case study cards. One link per card: the heading link stretches over the whole card
// (::after overlay), so each card is a single tab stop. The first card is a full-width Prussian sheet;
// the other three share one raised-surface treatment, three across from 1024px. While the cards are
// stacked (below 1024px) every card has the same inner padding, so the text column never jogs.
function Card({ r, feature = false }: { r: Release; feature?: boolean }) {
  const href = `/projects/${r.slug}`;
  const result = outcome(r);
  const cta = (cls: string) => (
    <p className={`nav-label items-center gap-1.5 ${feature ? "text-on-inverse" : "text-ink"} ${cls}`} aria-hidden="true">
      Read case study
      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
    </p>
  );

  if (feature) {
    return (
      <article className="work-card on-inverse group relative grid grid-cols-1 rounded-[var(--radius-card)] border border-line-inverse bg-inverse p-5 text-on-inverse md:p-7 lg:grid-cols-12 lg:gap-10 lg:p-11">
        <div className="flex flex-col lg:col-span-5">
          <p className="meta text-on-inverse-2">
            {r.kind} · {r.context}
          </p>
          <h3 className="t-h2 mt-3 text-on-inverse">
            <Link href={href} className="stretched-link">
              {r.name}
            </Link>
          </h3>
          {result && (
            <p className="mt-7 flex flex-col gap-2">
              <span className="numeral num-xl text-accent">{result.value}</span>
              <span className="t-lead font-medium text-on-inverse">{result.label}</span>
            </p>
          )}
          <p className="measure mt-5 text-on-inverse-2">{r.tagline}</p>
          <Stack items={r.stack} className="mt-4 text-on-inverse-3" />
          {/* Desktop: the CTA closes the left column. Below 1024px it moves to the end of the card. */}
          {cta("hidden lg:flex lg:mt-auto lg:pt-8")}
        </div>
        {/* Full-height column so the divider runs the whole card; the flow is centred inside it.
            Below 640px it is left to the case study, as on the smaller cards, so the card fits a phone screen. */}
        <div className="mt-8 border-t border-line-inverse pt-6 max-sm:hidden lg:col-span-7 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="meta mb-4 text-on-inverse-2">How it works</p>
          <FlowSteps steps={r.flow} label={`${r.name} workflow`} tone="dark" />
        </div>
        {cta("mt-8 flex lg:hidden")}
      </article>
    );
  }

  return (
    // From 1024px the three cards share seven subgrid rows (meta, title, result, tagline, stack, flow,
    // link), so the numerals, flows and links line up across the row whatever wraps in each card.
    <article className="work-card group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line-strong bg-surface-raised p-5 md:p-7 lg:row-span-7 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
      <p className="meta text-ink-3">
        {r.kind} · {r.context}
      </p>
      <h3 className="t-h3 mt-2 text-ink">
        <Link href={href} className="stretched-link">
          {r.name}
        </Link>
      </h3>
      {result && isMeasured(result) ? (
        <p className="mt-5 flex flex-col gap-1.5">
          <span className="numeral num-lg text-accent-ink">{result.value}</span>
          <span className="font-medium text-ink">{result.label}</span>
        </p>
      ) : result ? (
        // A word outcome ("Real time") is a quality, not a measurement: the numeral face one step down,
        // in ink rather than orange (the same rule on /projects and the case study). From 1024px it sits
        // on the bottom of the shared result row, so its label lines up with the numerals' labels.
        <p className="mt-5 flex flex-col gap-1.5 lg:self-end">
          <span className="numeral text-(length:--t-h2) text-ink">{result.value}</span>
          <span className="font-medium text-ink">{result.label}</span>
        </p>
      ) : r.status ? (
        <p className="mt-5">
          <span className="pill pill-build meta text-ink">{r.status}</span>
        </p>
      ) : (
        <span aria-hidden="true" />
      )}
      <p className="measure mt-4 text-ink-2">{r.tagline}</p>
      <Stack items={r.stack} className="mt-3 text-ink-3" />
      {/* Below 768px the flow is left to the case study page, so three cards don't each add a
          four-step list to an already long phone scroll. */}
      <div className="mt-6 border-t border-line pt-5 max-md:hidden">
        <FlowSteps steps={r.flow} label={`${r.name} workflow`} size="sm" />
      </div>
      {cta("mt-auto flex pt-6")}
    </article>
  );
}

export default function SelectedWork() {
  const list = selectedSlugs.map((s) => getRelease(s)).filter((r): r is Release => Boolean(r));
  const [first, ...rest] = list;
  // Worded from the data, so the line never claims more than the cards show: every card here is a
  // client build unless its context says it was self-built.
  const words = ["No", "One", "Two", "Three", "Four", "Five", "Six"];
  const count = words[list.length] ?? String(list.length);
  const selfBuilt = list.find((r) => r.context.startsWith("Self-built"));
  const intro = selfBuilt
    ? `${count} systems, from client builds to a self-built ${selfBuilt.kind}.`
    : `${count} systems built for clients.`;

  return (
    <section id="work" aria-labelledby="work-title" className="section-b bg-surface">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-y-3 md:grid-cols-12 md:items-end md:gap-x-10">
          <h2 id="work-title" className="t-h2 text-ink md:col-span-6">
            Selected work
          </h2>
          <p className="measure text-ink-2 md:col-span-6 md:justify-self-end">
            {intro} Client names stay private; each card says who it was built for.
          </p>
        </div>

        {/* No row gap at 1024px and up: the small cards' rows are subgrid tracks, so the space under the
            feature card is its own margin instead. */}
        <ul className="mt-8 grid grid-cols-1 gap-4 md:mt-12 md:gap-5 lg:grid-cols-3 lg:gap-y-0">
          {first && (
            <li className="lg:col-span-3 lg:mb-5">
              <Card r={first} feature />
            </li>
          )}
          {rest.map((r) => (
            <li key={r.slug} className="lg:row-span-7 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
              <Card r={r} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link className="btn-label flip flip-outline btn-lg" href="/projects">
            All {projectStats.total} projects <span aria-hidden="true">→</span>
          </Link>
          <span className="meta text-ink-3">{projectCountLine()}</span>
        </div>
      </div>
    </section>
  );
}
