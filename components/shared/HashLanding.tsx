"use client";

import { useEffect } from "react";

// Lands a deep link such as /projects/x#example-call on its target. The case study streams in behind
// loading.tsx, so neither the browser's own fragment scroll nor the router's hash scroll can find the
// element when they run (they fire on the loading state). This runs once the page itself has mounted.
// "instant", not smooth: html has scroll-behavior: smooth, and arriving on a new page should not glide.
export default function HashLanding({ id }: { id: string }) {
  useEffect(() => {
    let target = "";
    try {
      target = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    if (target !== id) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);
  return null;
}
