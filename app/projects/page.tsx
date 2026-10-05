import { Suspense } from "react";
import { releases, wings, type WingId } from "@/lib/data";
import { pageMeta } from "@/lib/site";
import ReleaseIndex, { ReleaseIndexView } from "@/components/projects/ReleaseIndex";

export const metadata = pageMeta({
  title: "Index",
  description: "Every release: voice AI agents, automation, AI agents and engineering work by Taimoor Asif.",
  path: "/projects",
});

const firstYear = Math.min(...releases.map((r) => r.year));

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const wingWord = NUMBER_WORDS[wings.length] ?? String(wings.length);

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.wing) ? sp.wing[0] : sp.wing;
  const initial: WingId | null = wings.find((w) => w.id === raw)?.id ?? null;

  return (
    <section className="bg-paper pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <h1 className="mast text-ink">Index</h1>
        <p className="measure mt-6 text-ink-2">
          Every release in the ledger, {releases.length} shipped since {firstYear}, across {wingWord}{" "}
          {wings.length === 1 ? "wing" : "wings"}. Pick a wing, open any entry for the full record.
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
