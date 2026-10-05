import Link from "next/link";
import { wingCount, wings, type WingId } from "@/lib/data";
import "@/components/shell/shell.css";

// One simple line icon per wing (replaces tiny screenshots, which are unreadable at card size).
function WingIcon({ id }: { id: WingId }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "voice":
      return (
        <svg {...common}>
          <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2" />
          <path d="M15 3.5a6 6 0 0 1 5.5 5.5" />
          <path d="M15 7a2.5 2.5 0 0 1 2 2" />
        </svg>
      );
    case "automation":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="6" height="5" rx="1.5" />
          <rect x="15" y="4" width="6" height="5" rx="1.5" />
          <rect x="9" y="15" width="6" height="5" rx="1.5" />
          <path d="M9 6.5h6M18 9v2.5a1.5 1.5 0 0 1-1.5 1.5H12v2M6 9v2.5A1.5 1.5 0 0 0 7.5 13H12" />
        </svg>
      );
    case "agents":
      return (
        <svg {...common}>
          <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
          <path d="M18.5 15.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" />
        </svg>
      );
    case "engineering":
      return (
        <svg {...common}>
          <path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15" />
        </svg>
      );
  }
}

// Colour treatment per card position, copied from the reference (paper-deep, night, violet, outlined).
const looks = [
  { card: "bg-paper-deep text-ink", num: "text-ink", sub: "text-ink-2", enter: "text-ink-2 group-hover:text-ink", chip: "border-line-strong" },
  {
    card: "on-dark bg-night text-on-night",
    num: "text-on-night",
    sub: "text-on-night-2",
    enter: "text-on-night-2 group-hover:text-on-night",
    chip: "border-line-night",
  },
  {
    card: "on-dark bg-violet-sheet text-on-violet",
    num: "text-on-violet",
    sub: "text-on-violet-2",
    enter: "text-on-violet-2 group-hover:text-on-violet",
    chip: "border-on-violet-2/40",
  },
  {
    card: "border border-line-strong bg-paper text-ink",
    num: "text-ink",
    sub: "text-ink-2",
    enter: "text-ink-2 group-hover:text-ink",
    chip: "border-line-strong",
  },
];

export default function Wings() {
  return (
    <section className="bg-paper pb-14 pt-16 md:pb-20 md:pt-24" aria-label="The four wings">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="display-1 text-ink">Four wings</h2>
          <p className="tag text-ink-3">One practice · pick a door</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {wings.map((w, i) => {
            const look = looks[i % looks.length];
            const count = wingCount(w.id);
            return (
              <Link
                key={w.id}
                className={`wing-card sheet group flex flex-col p-6 transition-transform duration-300 ease-out hover:-translate-y-1.5 md:p-7 ${look.card}`}
                href={`/projects?wing=${w.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className={`numeral text-[clamp(2.8rem,2rem+2.4vw,4.5rem)] ${look.num}`}>{String(i + 1).padStart(2, "0")}</p>
                  <span
                    aria-hidden="true"
                    className={`mt-1 flex h-11 w-11 items-center justify-center rounded-full border ${look.chip} ${look.num}`}
                  >
                    <WingIcon id={w.id} />
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="display-2">{w.name}</h3>
                  <span className={`tag whitespace-nowrap ${look.sub}`}>
                    {count} release{count === 1 ? "" : "s"}
                  </span>
                </div>
                <p className={`tag mt-2 ${look.sub}`}>{w.blurb}</p>
                <p className={`nav-label mt-6 flex items-center gap-2 md:mt-8 ${look.enter}`}>
                  Enter
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
