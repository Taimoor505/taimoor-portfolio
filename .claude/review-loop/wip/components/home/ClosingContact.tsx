import Link from "next/link";
import CopyEmail from "@/components/shared/CopyEmail";
import LocalTime from "@/components/shell/LocalTime";
import { profile } from "@/lib/data";

const outLink =
  "text-link inline-flex min-h-11 items-center text-on-inverse";

// The home page's closing sheet. It sits directly on the slim site footer (same Prussian surface),
// so contact details appear once, not in two stacked dark slabs.
export default function ClosingContact() {
  return (
    <section id="contact" aria-labelledby="contact-title" data-joins-footer="" className="on-inverse border-t border-line-inverse bg-inverse pb-6 pt-[var(--space-section)]">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-7">
            <h2 id="contact-title" className="t-h2 text-on-inverse">
              Get in touch
            </h2>
            <p className="measure t-lead mt-5 text-on-inverse">
              <span className="font-semibold">Open to: </span>
              {profile.openTo}
            </p>
            <p className="measure mt-3 text-on-inverse-2">
              If something here is close to what you need built, write to me. I’ll tell you honestly whether I’m the
              right person for it.
            </p>
            <div className="mt-9 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
              <a className="btn-label flip flip-accent btn-lg" href={`mailto:${profile.email}`}>
                Email me
              </a>
              <CopyEmail location="home_contact" className="btn-label flip flip-outline btn-lg" />
              {/* No inline padding, so the text starts on the column edge like everything above it.
                  /contact has no form that sends: it lists every channel and drafts an email, so the
                  link says that rather than promising a web form. */}
              <Link className="btn-label text-link inline-flex min-h-11 items-center text-on-inverse sm:ml-2" href="/contact">
                All contact options<span aria-hidden="true">&nbsp;→</span>
              </Link>
            </div>
            <p className="mt-5 break-all text-on-inverse-2">{profile.email}</p>
          </div>

          <dl className="md:col-span-4 md:col-start-9">
            <div className="border-t border-line-inverse py-4">
              <dt className="meta text-on-inverse-2">Replies</dt>
              <dd className="mt-1 text-on-inverse">{profile.replies}</dd>
            </div>
            <div className="border-t border-line-inverse py-4">
              <dt className="meta text-on-inverse-2">Local time</dt>
              <dd className="mt-1 text-on-inverse">
                {profile.locationLong} · <LocalTime />
              </dd>
            </div>
            {/* Rule: LinkedIn and GitHub are left out here because this sheet and the footer are one
                continuous Prussian surface, so they would show twice in the same block. /contact is the
                exception: it is the page people open to find every channel, so it lists them all. */}
            <div className="border-t border-line-inverse py-4">
              <dt className="meta text-on-inverse-2">Resume</dt>
              <dd className="mt-1">
                <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={outLink}>
                  <span className="sr-only">Resume: </span>View PDF <span aria-hidden="true">&nbsp;↗</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
