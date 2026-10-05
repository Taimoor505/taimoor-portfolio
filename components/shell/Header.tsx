"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { profile } from "@/lib/data";
import "./shell.css";

const links = [
  { label: "Index", path: "/projects" },
  { label: "Experience", path: "/experience" },
  { label: "Contact", path: "/contact" },
];

type LenisLike = { stop?: () => void; start?: () => void };
const lenis = () => (typeof window === "undefined" ? undefined : (window as unknown as { __lenis__?: LenisLike }).__lenis__);

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function DesktopNav({ pathname }: { pathname: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = links.find((l) => pathname === l.path || pathname.startsWith(`${l.path}/`))?.path;
  const shown = hovered ?? active;

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const wasVisible = useRef(false);
  const [pill, setPill] = useState<{ left: number; top: number; width: number; height: number; instant: boolean } | null>(
    null,
  );

  const measure = useCallback(
    (instant?: boolean) => {
      const el = shown ? itemRefs.current[shown] : null;
      if (!el) {
        wasVisible.current = false;
        setPill(null);
        return;
      }
      setPill({
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
        instant: instant ?? !wasVisible.current,
      });
      wasVisible.current = true;
    },
    [shown],
  );

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure(true));
    ro.observe(nav);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <nav
      ref={navRef}
      className="relative hidden items-center gap-1 md:flex"
      aria-label="Sections"
      onMouseLeave={() => setHovered(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(null);
      }}
    >
      {pill ? (
        <span
          aria-hidden="true"
          data-instant={pill.instant ? "true" : "false"}
          className="nav-pill pointer-events-none absolute rounded-full bg-ink"
          style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }}
        />
      ) : null}
      {links.map((l) => {
        const isActive = l.path === active;
        const isShown = shown === l.path;
        return (
          <Link
            key={l.path}
            ref={(el) => {
              itemRefs.current[l.path] = el;
            }}
            href={l.path}
            aria-current={isActive ? "page" : undefined}
            onMouseEnter={() => setHovered(l.path)}
            onFocus={() => setHovered(l.path)}
            className="nav-label relative px-4 py-2"
          >
            <span className={`relative z-[1] transition-colors duration-200 ${isShown ? "text-paper" : "text-ink-2"}`}>
              {l.label}
            </span>
          </Link>
        );
      })}
      <a
        href={profile.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-label flip flip-violet ml-3 px-4 py-2.5"
      >
        Resume <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    </nav>
  );
}

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // menu rendered (stays true during exit)
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Keep the menu mounted while its exit animation runs
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    if (prefersReducedMotion()) {
      setMounted(false);
      return;
    }
    const t = setTimeout(() => setMounted(false), 220);
    return () => clearTimeout(t);
  }, [open, mounted]);

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll + Escape while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis()?.stop?.();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      lenis()?.start?.();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close when the viewport grows to the desktop breakpoint
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    if (mq.matches) {
      setOpen(false);
      return;
    }
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  // Make the page behind the menu inert while open; return focus to the toggle on close
  useEffect(() => {
    if (!open) return;
    const targets = [
      document.getElementById("main"),
      document.querySelector<HTMLElement>("footer[role='contentinfo']"),
      document.querySelector<HTMLElement>("[data-scroll-top]"),
    ].filter((el): el is HTMLElement => el !== null);
    targets.forEach((el) => {
      el.inert = true;
    });
    return () => {
      targets.forEach((el) => {
        el.inert = false;
      });
      const menu = menuRef.current;
      const activeEl = document.activeElement;
      if (menu && activeEl && menu.contains(activeEl)) toggleRef.current?.focus();
    };
  }, [open]);

  // Move focus into the menu once it has rendered
  useEffect(() => {
    if (open && mounted) firstLinkRef.current?.focus();
  }, [open, mounted]);

  const compact = scrolled && !open;

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] px-3 md:px-5">
        <div
          className={`pointer-events-auto mx-auto flex max-w-[1600px] items-center justify-between gap-6 transition-[margin,padding,border-color,background-color,border-radius,box-shadow] duration-300 ease-out ${
            compact
              ? "mt-2.5 rounded-full border border-line bg-paper/85 px-4 py-2 shadow-[0_12px_32px_-16px_rgba(30,18,60,0.25)] backdrop-blur-md md:mt-3 md:px-6 md:py-2.5"
              : "border border-transparent bg-transparent px-2 py-4 md:px-5 md:py-5"
          }`}
        >
          <Link href="/" className="group flex items-center gap-2.5" aria-label={pathname === "/" ? `V2.0, ${profile.name}, home` : `${profile.name}, home`}>
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rotate-45 bg-violet transition-transform duration-300 group-hover:rotate-[135deg]"
            />
            {pathname === "/" ? (
              <span className="tag text-violet">V2.0</span>
            ) : (
              <span className="text-[16px] font-bold tracking-tight text-ink transition-colors group-hover:text-violet">
                {profile.name}
              </span>
            )}
          </Link>

          <DesktopNav pathname={pathname} />

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="ledger-menu"
            className="nav-label flip relative z-[75] px-4 py-2 text-ink hover:bg-ink hover:text-paper md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {mounted ? (
        <div
          ref={menuRef}
          id="ledger-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-closing={open ? "false" : "true"}
          className="shell-menu on-dark fixed inset-0 z-[65] flex flex-col bg-night px-5 pb-10 pt-24 md:hidden"
        >
          <nav aria-label="Sections" className="flex-1">
            <ul>
              {[{ label: "Home", path: "/" }, ...links].map((l, i) => {
                const isActive = pathname === l.path || (l.path !== "/" && pathname.startsWith(`${l.path}/`));
                return (
                  <li
                    key={l.path}
                    className="shell-menu-item border-b border-line-night"
                    style={{ ["--i" as string]: i } as CSSProperties}
                  >
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={l.path}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className="display-1 group flex items-baseline justify-between py-4"
                    >
                      <span className={isActive ? "text-violet-bright" : "text-on-night"}>{l.label}</span>
                      <span
                        aria-hidden="true"
                        className="text-[0.6em] text-on-night-3 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="shell-menu-item flex flex-col gap-4" style={{ ["--i" as string]: 4 } as CSSProperties}>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="tag-lg text-on-night-2"
            >
              Resume <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a href={`mailto:${profile.email}`} className="tag-lg text-on-night-2">
              {profile.email}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
