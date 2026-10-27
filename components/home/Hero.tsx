import Link from "next/link";
import { profile } from "@/lib/data";

const pipelineSteps = [
  { step: "01", label: "Phone order inbound", tool: "GoHighLevel Voice AI" },
  { step: "02", label: "Menu & total confirmed", tool: "Real-time pricing logic" },
  { step: "03", label: "Payment link created", tool: "n8n + Stripe API" },
  { step: "04", label: "SMS sent to caller", tool: "Twilio / SMS Gateway" },
  { step: "05", label: "Kitchen ticket printed", tool: "POS webhook integration" },
];

export default function Hero() {
  return (
    <section className="relative bg-paper pb-16 pt-24 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Positioning & CTAs */}
          <div className="flex flex-col lg:col-span-6 lg:pt-2">
            <div className="flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink-2">
              <span className="lamp" aria-hidden="true" />
              <span>Full-Stack &amp; AI Automation Engineer · {profile.location}</span>
            </div>

            <h1 className="mast mt-6 text-balance text-ink" style={{ fontSize: "clamp(2.4rem, 1.4rem + 3.8vw, 4.6rem)" }}>
              Production AI agents and revenue automations that run without babysitting<span className="text-violet">.</span>
            </h1>

            <p className="measure mt-6 text-lg leading-relaxed text-ink-2">
              I am {profile.name}, a full-stack software engineer based in Lahore. I build reliable voice AI agents, resilient CRM pipelines, and internal tools for growing teams and US businesses.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#selected-work"
                className="btn-label flip flip-violet px-7 py-4"
              >
                View selected work
              </a>
              <Link
                href="/contact"
                className="btn-label flip flip-outline px-7 py-4"
              >
                Get in touch
              </Link>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="tag ledger-link ml-1 py-2 text-ink-2"
              >
                Download resume <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens PDF in new tab)</span>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line-strong pt-6 font-mono text-xs text-ink-3">
              <span>{profile.currently}</span>
              <span className="text-ink-3/40">/</span>
              <span>Available for remote engineering roles and freelance builds</span>
            </div>
          </div>

          {/* Right Column: Live Production Pipeline & Architecture Artifact */}
          <div className="lg:col-span-6">
            <div className="mount overflow-hidden border border-line-night bg-night p-6 text-on-night shadow-[0_24px_50px_-16px_rgba(20,33,61,0.45)] md:p-8">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-night pb-5">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-bright" aria-hidden="true" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-on-night">
                    System Architecture / Voice Ordering
                  </span>
                </div>
                <span className="font-mono text-[11px] font-medium text-live">
                  [Production Deployed]
                </span>
              </div>

              {/* 5-Step Pipeline Flow */}
              <div className="mt-6">
                <p className="font-mono text-[11px] uppercase tracking-wider text-on-night-3">
                  Autonomous Order-to-Kitchen Pipeline
                </p>
                <ol className="mt-4 space-y-3">
                  {pipelineSteps.map((p, idx) => (
                    <li
                      key={p.step}
                      className="flex items-center justify-between gap-3 rounded-lg border border-line-night/60 bg-night-2/50 px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-violet-bright">{p.step}</span>
                        <span className="text-sm font-medium text-on-night">{p.label}</span>
                      </div>
                      <span className="font-mono text-xs text-on-night-3">{p.tool}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Illustrative Call Transcript Block */}
              <div className="mt-6 rounded-lg border border-line-night/80 bg-night-2/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-on-night-3">
                    Sample Call Transcript (Illustrative)
                  </span>
                  <span className="font-mono text-[11px] text-on-night-3">Inbound Audio Stream</span>
                </div>
                <div className="mt-3 space-y-2 text-xs leading-relaxed">
                  <p className="text-on-night-2">
                    <strong className="font-mono text-violet-bright">Agent:</strong> "Thanks for calling! Is this for pickup or delivery?"
                  </p>
                  <p className="text-on-night">
                    <strong className="font-mono text-on-night-3">Caller:</strong> "Pickup. Two large margherita pizzas and garlic bread."
                  </p>
                  <p className="text-on-night-2">
                    <strong className="font-mono text-violet-bright">Agent:</strong> "Got it. Total is $31.40. I have texted you a secure Stripe payment link."
                  </p>
                </div>
              </div>

              {/* Verified Result Strip */}
              <div className="mt-6 flex items-center justify-between border-t border-line-night pt-5">
                <div>
                  <span className="font-mono text-2xl font-bold text-violet-bright">0</span>
                  <span className="ml-2 text-sm text-on-night-2">staff touches from phone ring to printed ticket</span>
                </div>
                <Link
                  href="/projects/restaurant-voice-ordering"
                  className="font-mono text-xs font-semibold text-violet-bright underline decoration-violet-bright/50 underline-offset-4 hover:text-white"
                >
                  Case study →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
