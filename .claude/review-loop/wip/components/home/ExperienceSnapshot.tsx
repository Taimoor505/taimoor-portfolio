import Link from "next/link";
import RoleTimeline from "@/components/shared/RoleTimeline";

export default function ExperienceSnapshot() {
  return (
    <section aria-labelledby="experience-title" className="section bg-surface">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <h2 id="experience-title" className="t-h2 text-ink">
            Experience
          </h2>
          <Link className="text-link nav-label inline-flex min-h-11 items-center text-ink" href="/experience">
            Full experience<span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
        <p className="meta mt-3 text-ink-3">Current role first, then newest first.</p>
        <div className="mt-6 md:mt-8">
          {/* A short name for the list; the visible caption above already gives the order. */}
          <RoleTimeline label="Roles" />
        </div>
      </div>
    </section>
  );
}
