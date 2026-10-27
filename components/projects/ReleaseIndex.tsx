"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { releases, wings, wingCount, type WingId } from "@/lib/data";

function isWing(v: string | null): v is WingId {
  return !!v && wings.some((w) => w.id === v);
}

export function ReleaseList({ active }: { active: WingId | null }) {
  const list = active ? releases.filter((r) => r.wing === active) : releases;
  return (
    <ul className="mt-8 border-t border-line-strong">
      {list.map((r) => (
        <li key={r.slug} className="border-b border-line">
          <Link
            href={`/projects/${r.slug}`}
            className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 rounded-2xl py-5 pl-2 pr-3 transition-colors duration-200 hover:bg-ink md:grid-cols-[10rem_1fr_10rem_10rem_7rem] md:items-center md:px-5"
          >
            <span className="font-mono text-xs font-semibold tracking-wide text-violet transition-colors group-hover:text-violet-bright">
              {r.kind}
            </span>
            <span className="display-2 min-w-0 truncate !leading-[1.25] !text-[clamp(1.2rem,1rem+1vw,1.65rem)] text-ink transition-colors group-hover:text-paper">
              {r.name}
            </span>
            <span className="hidden font-mono text-xs text-ink-3 transition-colors group-hover:text-on-night-2 md:block">
              {r.context}
            </span>
            <div className="col-span-3 col-start-1 flex items-center gap-2 font-mono text-xs text-ink-2 transition-colors group-hover:text-on-night-2 md:col-span-1 md:col-start-auto">
              <span>{r.date}</span>
              {r.status && (
                <span className="rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-[11px] font-medium text-violet group-hover:border-violet-bright group-hover:text-violet-bright">
                  {r.status}
                </span>
              )}
            </div>
            <span className="col-start-3 row-start-1 font-mono text-xs font-medium text-ink-2 transition-colors group-hover:text-paper md:col-start-auto md:row-start-auto md:text-right">
              View <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FilterTab({
  pressed,
  label,
  count,
  onClick,
}: {
  pressed: boolean;
  label: string;
  count: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-lg px-4 py-2 font-mono text-xs font-medium transition-colors ${
        pressed
          ? "bg-ink text-paper shadow-sm"
          : "text-ink-2 hover:bg-paper hover:text-ink"
      }`}
    >
      <span>{label}</span>
      <span className={`ml-2 text-[11px] ${pressed ? "text-violet-bright" : "text-ink-3"}`}>
        {count}
      </span>
      <span className="sr-only"> projects</span>
    </button>
  );
}

export function ReleaseIndexView({ active, onPick }: { active: WingId | null; onPick?: (w: WingId | null) => void }) {
  const shown = active ? wingCount(active) : releases.length;
  const [announce, setAnnounce] = useState("");
  const prev = useRef(active);

  useEffect(() => {
    if (prev.current === active) return;
    prev.current = active;
    setAnnounce(`${shown} ${shown === 1 ? "project" : "projects"} shown`);
  }, [active, shown]);

  return (
    <div className="relative">
      <div
        className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-line-strong bg-paper-deep/70 p-1.5"
        role="group"
        aria-label="Filter projects by domain"
      >
        <FilterTab pressed={active === null} label="All Systems" count={releases.length} onClick={() => onPick?.(null)} />
        {wings.map((w) => (
          <FilterTab
            key={w.id}
            pressed={active === w.id}
            label={w.name}
            count={wingCount(w.id)}
            onClick={() => onPick?.(w.id)}
          />
        ))}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
      <ReleaseList active={active} />
    </div>
  );
}

export default function ReleaseIndex() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const raw = params.get("wing");
  const active = isWing(raw) ? raw : null;

  const pick = (w: WingId | null) => {
    if (w === active) return;
    try {
      posthog.capture("project_filter_selected", { domain: w ?? "all" });
    } catch {
      // Safe posthog call
    }
    const next = new URLSearchParams(params.toString());
    if (w) next.set("wing", w);
    else next.delete("wing");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return <ReleaseIndexView active={active} onPick={pick} />;
}
