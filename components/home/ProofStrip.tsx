import Link from "next/link";
import { getRelease, proofSlugs, type Release } from "@/lib/data";

// Outcome numbers, each taken unchanged from its project's `result` and linked to the case study.
// A ruled grid (1px gaps over the line colour), so cells share hairlines instead of doubling them.
export default function ProofStrip() {
  const items = proofSlugs
    .map((s) => getRelease(s))
    .filter((r): r is Release & { result: NonNullable<Release["result"]> } => Boolean(r?.result));

  return (
    <section aria-labelledby="proof-title" className="section-b bg-surface">
      <div className="wrap">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
          <h2 id="proof-title" className="t-h3 text-ink">
            Measured results
          </h2>
          <p className="t-sm text-ink-3">Each number links to the case study behind it.</p>
        </div>
        {/* Two columns from the smallest screens: four results take one short block, not a screen. */}
        {/* The rules stay at the wrap width like every other rule on the page. Cells in the first
            column drop their left padding, so the numerals line up with the heading. The left padding
            is set per breakpoint without overlapping variants (an sm: step would otherwise beat a
            max-lg: override). No hover fill (it would sit flush against those numerals): the label
            underlines and the arrow moves. */}
        <ul className="mt-5 grid grid-cols-2 gap-px border-y border-line-strong bg-line lg:grid-cols-4">
          {items.map((r, i) => {
            const firstCol2 = i % 2 === 0; // first column of the 2-up grid (below 1024px)
            const pad = `${firstCol2 ? "pl-0" : "pl-3 sm:pl-5"} ${i === 0 ? "lg:pl-0" : "lg:pl-5"}`;
            const words = r.name.split(" ");
            const last = words.pop();
            return (
              <li key={r.slug} className="proof-cell bg-surface">
                <Link href={`/projects/${r.slug}`} className={`group flex h-full flex-col py-5 pr-3 sm:pr-5 md:py-8 ${pad}`}>
                  {/* One line always ("45 min → 0" never splits). From 640px the size is capped by the
                      cell width (.proof-num), so the widest value clears the cell edge by 20px at every
                      width, including the narrow 4-up cells just above 1024px. */}
                  <span className="numeral num-md proof-num whitespace-nowrap text-accent-ink max-[359px]:text-(length:--t-h3)">
                    {r.result.value}
                  </span>
                  <span className="mt-2.5 font-medium text-ink decoration-line-strong decoration-[1.5px] underline-offset-[5px] group-hover:underline sm:mt-3 sm:text-(length:--t-lead)">
                    {r.result.label}
                  </span>
                  {/* The whole cell is the link. The project name and arrow stay visible at every width, so
                      each number says what it belongs to and reads as tappable. Names wrap rather than
                      truncate; the last word and the arrow never part, so the arrow can't wrap alone. */}
                  <span className="meta mt-auto block pt-3 text-ink-3 transition-colors group-hover:text-ink">
                    <span className="sr-only">Case study: </span>
                    {words.length > 0 && `${words.join(" ")} `}
                    <span className="whitespace-nowrap">
                      {last}
                      <span aria-hidden="true" className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
