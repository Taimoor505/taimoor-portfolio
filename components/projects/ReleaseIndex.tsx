"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { releases, wings, wingCount, type WingId } from "@/lib/data";

function isWing(v: string | null): v is WingId {
  return !!v && wings.some((w) => w.id === v);
}

function dateLine(date: string, status?: string) {
  return status ? `${date} · ${status.toLowerCase()}` : date;
}

export function ReleaseList({ active }: { active: WingId | null }) {
  const list = active ? releases.filter((r) => r.wing === active) : releases;
  return (
    <ul className="mt-10 border-t border-line-strong">
      {list.map((r) => (
        <li key={r.slug} className="border-b border-line">
          <Link
            href={`/projects/${r.slug}`}
            className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-1 rounded-2xl py-5 pl-2 pr-3 transition-colors duration-200 hover:bg-ink md:grid-cols-[7rem_1fr_12rem_12rem_6rem] md:items-center md:px-4"
          >
            <span className="tag-lg text-violet transition-colors group-hover:text-violet-bright">{r.version}</span>
            <span className="display-2 min-w-0 truncate !leading-[1.25] !text-[clamp(1.2rem,1rem+1vw,1.7rem)] text-ink transition-colors group-hover:text-paper">
              {r.name}
            </span>
            <span className="tag hidden text-ink-3 transition-colors group-hover:text-on-night-2 md:block">{r.kind}</span>
            <span className="tag col-span-3 col-start-1 text-ink-2 transition-colors group-hover:text-on-night-2 md:col-span-1 md:col-start-auto">
              {dateLine(r.date, r.status)}
            </span>
            <span className="tag col-start-3 row-start-1 text-ink-2 transition-colors group-hover:text-paper md:col-start-auto md:row-start-auto md:text-right">
              Open →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FilterButton({
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
      className={`group tag flip px-4 py-2.5 ${
        pressed ? "bg-ink text-paper" : "border border-line-strong text-ink-2 hover:bg-ink hover:text-paper"
      }`}
    >
      {label}
      <span className={`ml-2 ${pressed ? "text-violet-bright" : "text-violet group-hover:text-violet-bright"}`}>{count}</span>
      <span className="sr-only"> releases</span>
    </button>
  );
}

export function ReleaseIndexView({ active, onPick }: { active: WingId | null; onPick?: (w: WingId | null) => void }) {
  const shown = active ? wingCount(active) : releases.length;
  // Announce the visible count only after the filter changes, not on first render.
  const [announce, setAnnounce] = useState("");
  const prev = useRef(active);
  useEffect(() => {
    if (prev.current === active) return;
    prev.current = active;
    setAnnounce(`${shown} ${shown === 1 ? "release" : "releases"} shown`);
  }, [active, shown]);

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by wing">
        <FilterButton pressed={active === null} label="All" count={releases.length} onClick={() => onPick?.(null)} />
        {wings.map((w) => (
          <FilterButton
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
    const next = new URLSearchParams(params.toString());
    if (w) next.set("wing", w);
    else next.delete("wing");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return <ReleaseIndexView active={active} onPick={pick} />;
}
