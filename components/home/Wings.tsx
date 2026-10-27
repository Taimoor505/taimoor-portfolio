import Link from "next/link";
import { wings, wingCount, type WingId } from "@/lib/data";

function DomainIcon({ id }: { id: WingId }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
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

const domainTags: Record<WingId, string[]> = {
  voice: ["Retell AI", "GoHighLevel Voice", "Twilio", "ElevenLabs", "Speech-to-Text"],
  automation: ["n8n", "GoHighLevel", "Make.com", "Stripe API", "Webhooks & Retries"],
  agents: ["OpenAI & Claude APIs", "RAG Pipelines", "Prompt Engineering", "Structured JSON"],
  engineering: ["Next.js", "TypeScript", "Python / FastAPI", "Prisma", "PostgreSQL", "YOLO"],
};

export default function Wings() {
  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="bg-paper pb-20 pt-16 md:pb-28 md:pt-20">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-violet">
              Core Engineering Capabilities
            </span>
            <h2 id="capabilities-title" className="display-1 mt-2 text-ink">
              What I build<span className="text-violet">.</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-ink-3">End-to-end operational systems, not isolated POCs</p>
        </div>

        {/* Cohesive, unified Prussian dark cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wings.map((w, idx) => {
            const count = wingCount(w.id);
            const tags = domainTags[w.id] ?? [];
            return (
              <Link
                key={w.id}
                href={`/projects?wing=${w.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-line-night bg-night p-6 text-on-night transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-violet-bright/50 hover:shadow-[0_20px_40px_-15px_rgba(20,33,61,0.5)] md:p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-night bg-night-2/70 text-violet-bright">
                      <DomainIcon id={w.id} />
                    </span>
                    <span className="font-mono text-xs text-on-night-3">0{idx + 1}</span>
                  </div>

                  <h3 className="display-2 mt-6 text-on-night transition-colors group-hover:text-violet-bright">
                    {w.name}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-on-night-2">{w.blurb}</p>

                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line-night/70 pt-5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-line-night bg-night-2/40 px-2 py-0.5 font-mono text-[11px] text-on-night-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-line-night/70 pt-4 font-mono text-xs text-violet-bright">
                  <span>Explore {count} {count === 1 ? "project" : "projects"}</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
