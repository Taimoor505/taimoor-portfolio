"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function effectiveTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// The page surface in each theme, for the browser bar (the same values as viewport.themeColor in
// app/layout.tsx and the theme script there).
const THEME_COLORS: Record<Theme, string> = { light: "#ffffff", dark: "#0d1730" };

// An explicit choice overrides the OS-keyed theme-color metas: one unmedia'd meta, first in <head>,
// wins over them in every browser that reads theme-color.
function setBrowserBar(theme: Theme) {
  let meta = document.getElementById("theme-color-choice") as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.id = "theme-color-choice";
    document.head.prepend(meta);
  }
  meta.content = THEME_COLORS[theme];
}

// One source of truth for every toggle on the page: the <html data-theme> attribute (plus the OS
// setting when no choice is stored). Each instance subscribes to changes of that attribute, so the
// header toggle and the one in the mobile menu always report the same pressed state.
function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    mq.removeEventListener("change", onChange);
    mo.disconnect();
  };
}
const getSnapshot = () => effectiveTheme() === "dark";
// The server cannot know the theme, so aria-pressed is left off until hydration.
const getServerSnapshot = () => null;

// Light/dark switch. The icon is chosen by CSS from the active theme (shell.css), so the
// server render is correct before hydration; JS only adds aria-pressed and the click.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const dark = useSyncExternalStore<boolean | null>(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = effectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setBrowserBar(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked (private mode): the choice lasts for this page view only.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark ?? undefined}
      aria-label="Dark theme"
      title="Toggle dark theme"
      className={`theme-toggle flip relative z-[75] inline-flex h-11 w-11 items-center justify-center border ${className}`}
    >
      {/* Moon: shown in light theme */}
      <svg className="theme-icon-moon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />
      </svg>
      {/* Sun: shown in dark theme */}
      <svg className="theme-icon-sun" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
    </button>
  );
}
