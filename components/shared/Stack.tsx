// A stack or tag line ("Twilio · Vapi · GoHighLevel") that wraps only between items, never inside one,
// and never starts (or, with align="end", ends) a line with a separator. Spans only, so it can sit
// inside a link. The dots are decoration (empty alt text); screen readers get commas instead.
export default function Stack({
  items,
  align = "start",
  className = "",
}: {
  items: string[];
  /** "end-md": right-aligned from 768px (the dot that would trail a line is clipped instead). */
  align?: "start" | "end-md";
  className?: string;
}) {
  return (
    <span className={`stack meta ${className}`} data-align={align}>
      <span className="stack-row">
        {items.map((t, i) => (
          <span key={t} className="stack-item">
            {i > 0 && <span className="sr-only">, </span>}
            {t}
          </span>
        ))}
      </span>
    </span>
  );
}
