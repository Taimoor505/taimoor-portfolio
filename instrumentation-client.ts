// Analytics (PostHog). Runs in the browser before the app starts. Next.js 15.3+ loads this file automatically.
import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function trackingAllowed() {
  try {
    // Open the site once with ?notrack=1 to exclude your own browser. ?notrack=0 turns tracking back on.
    const flag = new URLSearchParams(location.search).get("notrack");
    if (flag === "1") localStorage.setItem("notrack", "1");
    if (flag === "0") localStorage.removeItem("notrack");
    return localStorage.getItem("notrack") !== "1";
  } catch {
    return true;
  }
}

if (!token || !host) {
  if (process.env.NODE_ENV === "development") {
    const missingVariable = token ? "NEXT_PUBLIC_POSTHOG_HOST" : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else if (trackingAllowed()) {
  posthog.init(token, {
    api_host: "/ingest",
    defaults: "2026-05-30",
    capture_exceptions: true,
  });

  // Links you send carry a tag, e.g. https://taimoor-portfolio-six.vercel.app/?ref=sandoo
  const ref = new URLSearchParams(location.search).get("ref");
  if (ref) posthog.register({ ref: ref.slice(0, 60) });

  // The clicks that matter: resume, email, LinkedIn, GitHub, WhatsApp.
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const kind = /resume\.pdf/i.test(href)
        ? "resume"
        : href.startsWith("mailto:")
          ? "email"
          : /linkedin\.com/i.test(href)
            ? "linkedin"
            : /github\.com/i.test(href)
              ? "github"
              : /wa\.me/i.test(href)
                ? "whatsapp"
                : null;
      if (kind) {
        const safeHref = kind === "resume" ? "/resume.pdf" : kind === "email" ? "mailto:" : `${kind}.com`;
        posthog.capture("contact_click", { kind, href: safeHref });
      }
    },
    { capture: true },
  );
}
