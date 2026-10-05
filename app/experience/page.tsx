import Link from "next/link";
import { profile, roles } from "@/lib/data";
import RoleEntry from "@/components/experience/RoleEntry";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Experience",
  description:
    "The professional record: AI Automation Engineer at Kode X Labs, software engineering at 8x, automation for a US agency, and computer vision at AdAxiom.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <div>
      <section className="bg-paper pb-24 pt-28 md:pb-32 md:pt-36">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <h1 className="mast text-ink">
            In
            <br />
            production<span className="text-violet">.</span>
          </h1>
          <p className="measure mt-6 text-lg text-ink-2">
            Where the work meets real businesses: voice agents, CRM automation, product code and computer vision.
            Newest first, with the stack each role ran on.
          </p>

          <div className="mt-14 border-t border-line-strong md:mt-20">
            {roles.map((role) => (
              <RoleEntry key={role.slug} role={role} />
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-24 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <p className="tag-lg flex items-center gap-2.5 text-violet">
                <span className="inline-block h-2 w-2 rotate-45 bg-violet" aria-hidden="true" />
                2020 to 2024
              </p>
              <p className="tag mt-2 text-ink-2">Education</p>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <h2 className="display-2 text-ink">BS Computer Science</h2>
              <p className="measure mt-5 text-ink-2">
                NCBA&amp;E, Lahore. The releases built since live in{" "}
                <Link className="ledger-link text-ink" href="/projects">
                  the index
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-4 md:mt-24">
            <Link className="btn-label flip flip-violet px-8 py-4" href="/contact">
              Work with me
            </Link>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-label flip flip-outline px-8 py-4"
            >
              Resume ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
