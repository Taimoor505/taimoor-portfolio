import Link from "next/link";
import { FormatOutcome } from "@/components/shared/FormatOutcome";

const metrics = [
  {
    value: "<2 min",
    label: "Lead response time",
    context: "Cut from hours with automated dedupe & routing",
    project: "Lead Response Automation",
    slug: "lead-response-automation",
  },
  {
    value: "65%",
    label: "Less footage review",
    context: "Real-time ANPR & PPE alerts for retail cameras",
    project: "Retail Security Analytics",
    slug: "retail-security-analytics",
  },
  {
    value: "45 min → 0",
    label: "Client onboarding setup",
    context: "Stripe-to-subaccount provisioning on signup",
    project: "Agency Client Onboarding",
    slug: "agency-client-onboarding",
  },
  {
    value: "300+",
    label: "Leads synced monthly",
    context: "Consolidating outreach engines into one CRM",
    project: "Outreach Inbox Unification",
    slug: "outreach-inbox-unification",
  },
  {
    value: "0",
    label: "Duplicate dials",
    context: "Idempotent Redis locking for outbound callers",
    project: "Appointment Confirmation Agent",
    slug: "appointment-confirmation-agent",
  },
  {
    value: "24/7",
    label: "Voice order coverage",
    context: "Autonomous ordering, payment texting & POS ticket printing",
    project: "Restaurant Voice Ordering Agent",
    slug: "restaurant-voice-ordering",
  },
];

export default function ProofStrip() {
  return (
    <section aria-labelledby="proof-title" className="border-y border-line-strong bg-paper-deep/40 py-14 md:py-18">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-violet">
              Telemetry &amp; Business Impact
            </span>
            <h2 id="proof-title" className="display-2 mt-2 text-ink">
              Measured production outcomes
            </h2>
          </div>
          <p className="font-mono text-xs text-ink-3">Verified operational data from deployed client systems</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metrics.map((m) => (
            <Link
              key={m.slug}
              href={`/projects/${m.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-line-strong bg-paper p-5 transition-all duration-200 hover:-translate-y-1 hover:border-violet/60 hover:shadow-md"
            >
              <div>
                <p className="font-mono text-3xl font-bold tracking-tight text-violet md:text-4xl">
                  <FormatOutcome value={m.value} />
                </p>
                <h3 className="mt-2 text-sm font-semibold text-ink group-hover:text-violet">
                  {m.label}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-3">{m.context}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-line pt-3 font-mono text-[11px] text-ink-2 group-hover:text-violet">
                <span className="truncate">{m.project}</span>
                <span aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
