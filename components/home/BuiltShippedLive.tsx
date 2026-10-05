"use client";

import { useEffect, useRef } from "react";
import { profile, releases } from "@/lib/data";

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function words(n: number): string {
  if (n < 20) return ONES[Math.max(0, n)];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
  return String(n);
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lin = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

// Progress runs from the section's top entering the viewport bottom (0) to its bottom leaving the top (1).
// Ranges measured on the reference: Built fades out .26 to .34, Shipped rises in .30 to .38 and fades out
// .54 to .62, Live rises in .58 to .66. Incoming words travel up from translateY(18%).
// With reduced motion the words only cross-fade: no translateY travel.
function apply(p: number, els: (HTMLParagraphElement | null)[], still: boolean) {
  const rise = (inn: number) => (still || inn >= 1 ? "none" : `translateY(${18 * (1 - inn)}%)`);
  const [built, shipped, live] = els;
  if (built) {
    built.style.opacity = String(1 - lin(p, 0.26, 0.34));
    built.style.transform = "none";
  }
  if (shipped) {
    const inn = lin(p, 0.3, 0.38);
    const out = lin(p, 0.54, 0.62);
    shipped.style.opacity = String(p < 0.46 ? inn : 1 - out);
    shipped.style.transform = rise(inn);
  }
  if (live) {
    const inn = lin(p, 0.58, 0.66);
    live.style.opacity = String(inn);
    live.style.transform = rise(inn);
  }
}

export default function BuiltShippedLive() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      apply((vh - r.top) / (r.height + vh), wordRefs.current, mq.matches);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    mq.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const years = new Date().getFullYear() - profile.startedYear;
  const caption = `${words(years)} ${years === 1 ? "year" : "years"} · ${words(releases.length)} releases · every one of them real`;
  const capitalised = caption.charAt(0).toUpperCase() + caption.slice(1);

  return (
    <section ref={sectionRef} className="on-dark relative h-[280vh] px-2 md:px-4">
      <div className="sheet sticky top-2 flex h-[calc(100svh-1rem)] flex-col items-center justify-center overflow-hidden bg-night">
        <div className="relative h-[1.1em] w-full" style={{ fontSize: "var(--t-mast)" }}>
          <p
            ref={(n) => {
              wordRefs.current[0] = n;
            }}
            className="mast absolute inset-x-0 text-center text-on-night"
            style={{ opacity: 1, transform: "none" }}
          >
            Built.
          </p>
          <p
            ref={(n) => {
              wordRefs.current[1] = n;
            }}
            className="mast absolute inset-x-0 text-center text-on-night"
            style={{ opacity: 0, transform: "translateY(18%)" }}
          >
            Shipped.
          </p>
          <p
            ref={(n) => {
              wordRefs.current[2] = n;
            }}
            className="mast absolute inset-x-0 text-center text-violet-bright"
            style={{ opacity: 0, transform: "translateY(18%)" }}
          >
            Live.
          </p>
        </div>
        <p className="tag absolute bottom-8 max-w-[85%] px-6 text-center text-on-night-3 md:bottom-10" suppressHydrationWarning>
          {capitalised}
        </p>
      </div>
    </section>
  );
}
