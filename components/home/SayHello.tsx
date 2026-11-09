import Link from "next/link";
import { profile } from "@/lib/data";
import "@/components/shell/shell.css";

const elsewhereLink =
  "tag-lg text-on-violet underline decoration-on-violet-2/60 decoration-2 underline-offset-[6px] transition-colors hover:decoration-paper";

export default function SayHello() {
  return (
    <section className="mx-2 py-2 md:mx-4 md:py-4">
      <div className="sheet on-violet bg-violet-sheet py-24 md:py-36">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-7">
              <h2 className="mast text-on-violet">
                Say
                <br />
                hello.
              </h2>
              <p className="measure mt-8 text-lg text-on-violet-2">
                Have a workflow that eats hours every week? Tell me what it is, which tools are involved, and your timeline. I will let you know honestly whether I am the right fit.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link className="btn-label flip bg-paper px-8 py-4 text-ink hover:bg-night hover:text-on-night" href="/contact">
                  Start a project
                </Link>
                <a
                  href={`mailto:${profile.email}`}
                  className="btn-label flip border border-on-violet-2/60 px-8 py-4 text-on-violet hover:border-paper hover:bg-paper hover:text-ink"
                >
                  {profile.email}
                </a>
              </div>
            </div>
            <dl className="md:col-span-4 md:col-start-9 md:pt-3">
              <div className="border-t border-on-violet-2/35 py-5">
                <dt className="tag text-on-violet-2">Currently</dt>
                <dd className="mt-1.5 font-medium text-on-violet">
                  <span className="flex items-center gap-2.5">
                    <span className="lamp" aria-hidden="true" />
                    {profile.currently}
                  </span>
                </dd>
              </div>
              <div className="border-t border-on-violet-2/35 py-5">
                <dt className="tag text-on-violet-2">Response</dt>
                <dd className="mt-1.5 font-medium text-on-violet">
                  <span>Typical reply time: within 24 hours</span>
                </dd>
              </div>
              <div className="border-t border-on-violet-2/35 py-5">
                <dt className="tag text-on-violet-2">Replies</dt>
                <dd className="mt-1.5 font-medium text-on-violet">{profile.replies}</dd>
              </div>
              <div className="border-t border-on-violet-2/35 py-5">
                <dt className="tag text-on-violet-2">Elsewhere</dt>
                <dd className="mt-2.5 flex flex-wrap gap-x-6 gap-y-2">
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className={elsewhereLink}>
                    GitHub <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={elsewhereLink}>
                    LinkedIn <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={elsewhereLink}>
                    Resume <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
