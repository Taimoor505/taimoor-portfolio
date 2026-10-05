"use client";

import { useEffect, useState } from "react";

// Live Lahore time, refreshed every 30s (same as the reference).
export default function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time} PKT</span>;
}
