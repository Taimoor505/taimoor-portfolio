import { Suspense } from "react";
import { releases, wings, type WingId } from "@/lib/data";
import { pageMeta } from "@/lib/site";
import ReleaseIndex, { ReleaseIndexView } from "@/components/projects/ReleaseIndex";

export const metadata = pageMeta({
  title: "Projects",
  description: "Production systems built by Taimoor Asif: voice AI agents, CRM and revenue automation, AI workflows, and full-stack software engineering.",
  path: "/projects",
});

const firstYear = Math.min(...releases.map((r) => r.year));

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.wing) ? sp.wing[0] : sp.wing;
  const initial: WingId | null = wings.find((w) => w.id === raw)?.id ?? null;

  return (
    <section className="bg-paper pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <h1 className="mast text-ink">Projects<span className="text-violet">.</span></h1>
        <p className="measure mt-6 text-lg text-ink-2">
          Production systems, voice agents, and client automations built since {firstYear}. Filter by domain to explore the technical architecture, stack, and measurable business outcomes.
        </p>
        <div className="mt-12 md:mt-16">
          <Suspense fallback={<ReleaseIndexView active={initial} />}>
            <ReleaseIndex />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
