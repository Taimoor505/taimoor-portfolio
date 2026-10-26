"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { profile } from "@/lib/data";

// Copies the address, for visitors whose mailto: links open nothing (webmail users).
// The visible label changes to "Copied" and a polite live region announces it.
export default function CopyEmail({ location, className = "" }: { location: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2500);
    return () => clearTimeout(t);
  }, [state]);

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(profile.email);
      ok = true;
    } catch {
      // Older browsers or a denied permission: fall back to a hidden textarea.
      try {
        const ta = document.createElement("textarea");
        ta.value = profile.email;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        ta.remove();
      } catch {
        ok = false;
      }
    }
    setState(ok ? "copied" : "failed");
    if (ok) posthog.capture("email_copied", { location });
  }

  return (
    <>
      <button type="button" onClick={copy} className={className}>
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy email"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? `${profile.email} copied to clipboard`
          : state === "failed"
            ? `Could not copy. The address is ${profile.email}`
            : ""}
      </span>
    </>
  );
}
