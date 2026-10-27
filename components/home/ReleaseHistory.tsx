"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FlowScreen from "@/components/shared/FlowScreen";
import { releasesByYear, years, type Release } from "@/lib/data";

// Year groups: the union of release years and milestone years, newest first, so a year with only
// milestones (e.g. 2024, 2023) still renders under its own heading with its caption.
function buildGroups(): [number, Release[]][] {
  const byYear = new Map(releasesByYear());
  const all = new Set<number>([...byYear.keys(), ...years.map((y) => y.year)]);
  return [...all].sort((a, b) => b - a).map((y): [number, Release[]] => [y, byYear.get(y) ?? []]);
}
const hasStartYear = years.some((y) => y.year === 2023);

// Full cards for releases with a measured result or a live status; the rest collapse to compact rows,
// mirroring how the reference collapses its less notable entries.
const isFull = (r: Release) => Boolean(r.result || r.status);

function FullCard({ r }: { r: Release }) {
  const href = `/projects/${r.slug}`;
  return (
    <li className="relative border-b border-line py-10 pl-6 md:py-14 md:pl-10" data-spine={r.name}>
      <span className="absolute left-0 top-[3.2rem] h-px w-4 bg-ink md:top-[4.2rem] md:w-6" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
        <div className="flex flex-col md:col-span-4">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-xs">
            <span className="font-semibold text-violet">{r.kind}</span>
            <span className="text-ink-2">{r.date}</span>
            <span className="text-ink-3">{r.context}</span>
          </div>
          <h3 className="display-2 mt-3 text-balance text-ink">
            <Link className="transition-colors hover:text-violet" href={href}>
              {r.name}
            </Link>
          </h3>
          <p className="measure mt-3 text-ink-2">{r.tagline}</p>
          <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-ink-3">
            {r.stack.slice(0, 4).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
          <div className="mt-6 md:mt-auto md:pt-6">
            <Link className="btn-label flip flip-outline inline-block px-6 py-3.5" href={href}>
              View case study →
            </Link>
          </div>
        </div>
        <div className="md:col-span-8">
          <Link aria-label={`${r.name}, view case study`} href={href}>
            <div className="mount group relative aspect-[16/9]">
              <FlowScreen release={r} variant="sm" />
            </div>
          </Link>
        </div>
      </div>
    </li>
  );
}

function CompactRow({ r }: { r: Release }) {
  return (
    <li className="relative border-b border-line" data-spine={r.name}>
      <Link
        className="group flex flex-wrap items-baseline gap-x-5 gap-y-1 rounded-2xl py-5 pl-6 pr-4 transition-colors duration-200 hover:bg-ink md:pl-10"
        href={`/projects/${r.slug}`}
      >
        <span
          className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-ink transition-colors group-hover:bg-paper md:w-6"
          aria-hidden="true"
        />
        <span className="font-mono text-xs font-semibold text-violet transition-colors group-hover:text-violet-bright">{r.kind}</span>
        <span className="display-2 !text-[1.15rem] text-ink transition-colors group-hover:text-paper md:!text-[1.35rem]">
          {r.name}
        </span>
        <span className="hidden font-mono text-xs text-ink-3 transition-colors group-hover:text-on-night-2 sm:inline">{r.context}</span>
        <span className="ml-auto font-mono text-xs text-ink-2 transition-colors group-hover:text-paper">View →</span>
      </Link>
    </li>
  );
}

function Milestone({ date, text, current, link = true }: { date: string; text: string; current?: boolean; link?: boolean }) {
  return (
    <li className="relative border-b border-line py-6 pl-6 md:pl-10">
      <span className="absolute left-0 top-[2.1rem] h-2 w-2 -translate-y-1/2 rotate-45 bg-violet" aria-hidden="true" />
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-xs font-semibold text-violet">{date}</span>
        {current && (
          <span className="tag flex items-center gap-2 text-ink-2">
            <span className="lamp" aria-hidden="true" /> Current role
          </span>
        )}
      </div>
      <p className="measure mt-2 text-ink">
        {text}{" "}
        {link && (
          <Link className="ledger-link whitespace-nowrap text-ink" href="/experience">
            Experience record →
          </Link>
        )}
      </p>
    </li>
  );
}

export default function ReleaseHistory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [spine, setSpine] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const groups = buildGroups();

  // Floating bottom-left chip: shows the release currently passing the upper third of the viewport.
  // The scroll listener only runs while the section is on screen (IntersectionObserver gate).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    let listening = false;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const line = vh * 0.3;
      const r = el.getBoundingClientRect();
      const items = Array.from(el.querySelectorAll<HTMLElement>("li[data-spine]"));
      let active: string | null = null;
      for (const li of items) {
        if (li.getBoundingClientRect().top <= line) active = li.dataset.spine ?? null;
        else break;
      }
      setSpine(active);
      setShow(active !== null && r.top <= line && r.bottom >= vh * 0.6);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const start = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      onScroll();
    };
    const stop = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      setShow(false);
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) start();
        else stop();
      }
    });
    io.observe(section);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <section id="selected-work" ref={sectionRef} className="bg-paper py-20 md:py-28" aria-label="Selected work and production systems">
      <div
        aria-hidden="true"
        className={`tag pointer-events-none fixed bottom-5 left-5 z-[60] hidden items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-paper transition-opacity duration-300 md:flex ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="inline-block h-3 w-px bg-violet-bright" />
        {spine ?? "···"}
      </div>
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <h2 className="display-1 text-ink">Selected work<span className="text-violet">.</span></h2>
        <p className="measure mt-4 text-lg text-ink-2">
          Production voice agents, CRM automations, and full-stack software deployed for commercial clients.
        </p>
        <div className="mt-14 md:mt-20">
          {groups.map(([year, list], gi) => {
            const meta = years.find((y) => y.year === year);
            const isLast = gi === groups.length - 1;
            return (
              <div key={year} className="grid grid-cols-1 gap-6 pb-14 last:pb-0 md:grid-cols-12 md:gap-10 md:pb-24">
                <div className="md:col-span-3">
                  <div className="md:sticky md:top-28">
                    <p className="numeral text-[clamp(3.4rem,7vw,6.5rem)] text-ink">{year}</p>
                    {meta && <p className="tag mt-3 max-w-[26ch] text-ink-3">{meta.caption}</p>}
                  </div>
                </div>
                <ul className="border-t border-line-strong md:col-span-9">
                  {list.map((r) => (isFull(r) ? <FullCard key={r.slug} r={r} /> : <CompactRow key={r.slug} r={r} />))}
                  {meta?.milestones.map((m) => (
                    <Milestone key={m.date + m.text} date={m.date} text={m.text} current={m.current} />
                  ))}
                  {isLast && !hasStartYear && (
                    <Milestone
                      date="Jun 2023"
                      text="Started writing code in a Python internship. Everything above came after it."
                      link={false}
                    />
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
