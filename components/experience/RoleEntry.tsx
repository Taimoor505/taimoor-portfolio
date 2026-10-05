import type { Role } from "@/lib/data";

export default function RoleEntry({ role }: { role: Role }) {
  return (
    <article className="grid grid-cols-1 gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
      <div className="md:col-span-3">
        <p className="tag-lg flex items-center gap-2.5 text-violet">
          <span className="inline-block h-2 w-2 rotate-45 bg-violet" aria-hidden="true" />
          {role.period}
        </p>
        <p className="tag mt-2 text-ink-3">
          {role.duration} · {role.type}
        </p>
        <p className="tag mt-1 text-ink-3">{role.location}</p>
        {role.current && (
          <p className="tag mt-3 flex items-center gap-2 text-ink-2">
            <span className="lamp" aria-hidden="true" /> current
          </p>
        )}
      </div>
      <div className="md:col-span-8 md:col-start-5">
        <h2 className="display-1 text-ink">{role.title}</h2>
        <p className="tag-lg mt-2 text-ink-2">{role.org}</p>
        <p className="measure mt-5 text-ink-2">{role.summary}</p>
        {role.areas.length > 0 && (
          <ul className="mt-8 border-t border-line">
            {role.areas.map((area) => (
              <li key={area.title} className="border-b border-line py-5">
                <h3 className="diff-add text-lg font-semibold tracking-tight text-ink">{area.title}</h3>
                <p className="measure mt-1.5 pl-[1.55em] text-ink-2">{area.text}</p>
              </li>
            ))}
          </ul>
        )}
        {role.stack.length > 0 && (
          <p className="tag mt-6 flex flex-wrap gap-x-5 gap-y-2 text-ink-3">
            {role.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}
