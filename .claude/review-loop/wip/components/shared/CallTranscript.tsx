import Link from "next/link";
import type { ReactNode } from "react";
import type { Release } from "@/lib/data";
import "./shared.css";

// The example call for a voice project, as real readable text.
// Every transcript in lib/data is illustrative, so the caption always says so.
// `mobileLines` + `moreHref`: below 640px only the first lines show, followed by a link to the full call,
// so a short excerpt doesn't take a whole phone screen (used in the home hero).
export default function CallTranscript({
  release,
  headingLevel = "h3",
  className = "",
  mobileLines,
  moreHref,
  moreNote,
}: {
  release: Release;
  headingLevel?: "h2" | "h3";
  className?: string;
  mobileLines?: number;
  moreHref?: string;
  /** Below 640px only: a line set in the card's footer, above the "Read the full call" link. */
  moreNote?: ReactNode;
}) {
  const lines = release.transcript ?? [];
  if (!lines.length) return null;
  const Heading = headingLevel;
  const trimmed = mobileLines !== undefined && moreHref !== undefined && lines.length > mobileLines;
  return (
    <figure className={`call on-inverse ${className}`}>
      <figcaption className="call-head">
        <Heading className="call-title">Illustrative example call</Heading>
        <span className="call-sub meta">Written as an example, not a recording of a real customer</span>
      </figcaption>
      <ol className="call-lines">
        {lines.map((l, i) => (
          <li key={i} className={`call-line ${trimmed && i >= mobileLines ? "max-sm:hidden" : ""}`} data-who={l.who}>
            <span className="call-who meta">{l.who === "agent" ? "Agent" : "Caller"}</span>
            <p className="call-text">{l.text}</p>
          </li>
        ))}
      </ol>
      {trimmed ? (
        <div className="call-more sm:hidden">
          {moreNote ? <p className="call-note">{moreNote}</p> : null}
          <p>
            <Link className="text-link nav-label inline-flex min-h-11 items-center text-on-inverse" href={moreHref}>
              Read the full call<span aria-hidden="true">&nbsp;→</span>
            </Link>
          </p>
        </div>
      ) : null}
    </figure>
  );
}
