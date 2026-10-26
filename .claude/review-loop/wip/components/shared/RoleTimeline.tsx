import Link from "next/link";
import { roleTypeLabel, rolesCurrentFirst } from "@/lib/data";
import "./shared.css";

// Compact career timeline in the same order as /experience: current role first, then newest first.
// A contract whose dates sit inside another role is labelled "Contract alongside …" (derived from the
// dates in lib/data, never typed by hand). Each entry jumps to its full entry on /experience.
export default function RoleTimeline({ label = "Career timeline" }: { label?: string }) {
  const roles = rolesCurrentFirst();
  return (
    <ol className="timeline" aria-label={label}>
      {roles.map((r) => (
        <li key={r.slug} className="timeline-item" data-current={r.current ? "" : undefined}>
          <Link className="timeline-link" href={`/experience#${r.slug}`}>
            <span className="timeline-period meta">{r.period}</span>
            <span className="timeline-org">
              <span className="timeline-org-name">{r.org}</span>
              {r.current && <span className="timeline-badge meta">Current</span>}
            </span>
            <span className="timeline-title">{r.title}</span>
            <span className="timeline-type meta">{roleTypeLabel(r)}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
