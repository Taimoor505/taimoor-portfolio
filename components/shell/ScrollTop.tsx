"use client";

import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      aria-hidden={show ? undefined : true}
      tabIndex={show ? 0 : -1}
      data-scroll-top=""
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.querySelector<HTMLElement>("header a[href]")?.focus({ preventScroll: true });
      }}
      className="flip fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper shadow-[0_12px_28px_-12px_rgba(10,8,20,0.55)] hover:bg-violet hover:text-on-violet"
      style={{
        opacity: show ? 1 : 0,
        translate: show ? "none" : "0 8px",
        pointerEvents: show ? "auto" : "none",
        transition: "opacity .3s var(--ease-exit), translate .3s var(--ease-exit), background-color .2s, color .2s",
      }}
    >
      <span aria-hidden="true" className="text-[15px] font-bold">
        ↑
      </span>
    </button>
  );
}
