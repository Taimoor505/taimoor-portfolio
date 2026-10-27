"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { profile } from "@/lib/data";

export default function CopyEmail({
  location = "contact",
  className = "",
}: {
  location?: string;
  className?: string;
}) {
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
    if (ok) {
      try {
        posthog.capture("email_copied", { location });
      } catch {
        // Safe posthog capture
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={className || "btn-label flip flip-outline px-6 py-3.5"}
        aria-label={`Copy email address ${profile.email}`}
      >
        {state === "copied" ? "✓ Copied to clipboard" : state === "failed" ? "Copy failed" : "Copy email address"}
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
