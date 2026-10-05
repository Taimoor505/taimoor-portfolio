import { profile } from "@/lib/data";
import { pageMeta } from "@/lib/site";
import ContactForm from "@/components/shell/ContactForm";

export const metadata = pageMeta({
  title: "Contact",
  description: "Get in touch with Taimoor Asif about remote AI engineering roles or automation projects.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="bg-paper pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <h1 className="mast text-ink">
          Say
          <br />
          hello.
        </h1>
        <div className="mt-14 grid grid-cols-1 gap-14 md:mt-20 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <p className="measure text-ink-2">
              Have a role, a project, or just an idea worth building? Send a message. {profile.replies}.
            </p>
            <dl className="mt-10 space-y-7 border-t border-line-strong pt-8">
              <div>
                <dt className="tag text-ink-3">Email</dt>
                <dd className="mt-1.5">
                  <a
                    href={`mailto:${profile.email}`}
                    className="display-2 break-all !text-[clamp(1.2rem,1rem+1vw,1.6rem)] text-ink transition-colors hover:text-violet"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="tag text-ink-3">Elsewhere</dt>
                <dd className="tag mt-2 flex flex-wrap gap-x-6 gap-y-2">
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="ledger-link text-ink-2">
                    GitHub <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="ledger-link text-ink-2">
                    LinkedIn <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="ledger-link text-ink-2">
                    Resume <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt className="tag text-ink-3">Status</dt>
                <dd className="mt-2 flex items-center gap-2.5 text-ink">
                  <span className="lamp" aria-hidden="true" />
                  {profile.currently}
                </dd>
              </div>
              <div>
                <dt className="tag text-ink-3">Location</dt>
                <dd className="mt-1.5 text-ink">{`${profile.locationLong} · ${profile.utc}`}</dd>
              </div>
            </dl>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
