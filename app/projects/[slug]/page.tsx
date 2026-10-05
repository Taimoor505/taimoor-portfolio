import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { releases, getRelease } from "@/lib/data";
import { pageMeta } from "@/lib/site";
import FlowScreen from "@/components/shared/FlowScreen";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return releases.map((r) => ({ slug: r.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = getRelease(slug);
  if (!r) return { title: "Release not found" };
  return pageMeta({
    title: `${r.version}, ${r.name}`,
    // LinkedIn wants 100+ characters: tagline, result when there is one, then the stack.
    description: [
      `${r.tagline}.`,
      r.result && r.result.value !== "Shipped" ? `Result: ${r.result.value} ${r.result.label}.` : "",
      `Built with ${r.stack.slice(0, 4).join(", ")}.`,
    ]
      .filter(Boolean)
      .join(" "),
    path: `/projects/${r.slug}`,
    image: `/projects/${r.slug}/opengraph-image`,
    type: "article",
  });
}

export default async function ReleasePage({ params }: Props) {
  const { slug } = await params;
  const release = getRelease(slug);
  if (!release) notFound();

  // Data is newest first: the next item is earlier, the previous one is later.
  const i = releases.findIndex((r) => r.slug === release.slug);
  const earlier = releases[i + 1];
  const later = i > 0 ? releases[i - 1] : undefined;

  return (
    <article className="bg-paper pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Link href="/projects" className="tag ledger-link text-ink-2">
          ← Release index
        </Link>

        <header className="mt-8 md:mt-10">
          <p className="numeral text-[clamp(2.6rem,1.4rem+5.5vw,6.5rem)] text-violet">{release.version}</p>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="tag text-ink-2">{release.dateLong}</span>
            <span className="tag text-ink-3">{release.kind}</span>
            {release.status && (
              <span className="tag rounded-full border border-violet px-3 py-1 text-violet">{release.status}</span>
            )}
          </div>
          <h1 className="mast mt-3 break-words text-ink" style={{ fontSize: "clamp(2.6rem, 1rem + 7.5vw, 8rem)" }}>
            {release.name}
          </h1>
          <p className="measure mt-6 text-lg text-ink-2">{release.tagline}</p>
        </header>

        <div className="mt-12 md:mt-16">
          <div className="mount relative aspect-[16/9] md:hidden">
            <FlowScreen release={release} variant="sm" />
          </div>
          <div className="mount relative hidden aspect-[16/9] md:block">
            <FlowScreen release={release} variant="lg" />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <h2 className="display-2 text-ink">What shipped</h2>
            <ul className="mt-6 border-t border-line-strong">
              {release.shipped.map((s) => (
                <li key={s} className="diff-add border-b border-line py-3.5 text-ink">
                  {s}
                </li>
              ))}
            </ul>
            <h2 className="display-2 mt-12 text-ink">Built with</h2>
            <p className="tag mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-line-strong pt-5 text-ink-2">
              {release.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="display-2 text-ink">About this release</h2>
            <p className="measure mt-6 border-t border-line-strong pt-6 leading-[1.75] text-ink-2">{release.about}</p>
          </div>
        </div>

        <nav
          aria-label="Adjacent releases"
          className="mt-20 grid grid-cols-1 gap-4 border-t border-line-strong pt-8 sm:grid-cols-2 md:mt-28"
        >
          {earlier ? (
            <Link href={`/projects/${earlier.slug}`} className="group block">
              <span className="tag text-ink-3">← Earlier</span>
              <span className="display-2 mt-1 block text-ink transition-colors group-hover:text-violet">
                {earlier.version} · {earlier.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {later ? (
            <Link href={`/projects/${later.slug}`} className="group block sm:text-right">
              <span className="tag text-ink-3">Later →</span>
              <span className="display-2 mt-1 block text-ink transition-colors group-hover:text-violet">
                {later.version} · {later.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </article>
  );
}
