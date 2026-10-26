import type { FlowStep } from "@/lib/data";
import "./shared.css";

// A readable workflow: real text, numbered steps, the tool for each step in mono.
// Vertical on narrow containers, a row of steps once there is room (container query in shared.css).
export default function FlowSteps({
  steps,
  label,
  tone = "light",
  size = "md",
}: {
  steps: FlowStep[];
  label: string;
  tone?: "light" | "dark";
  size?: "sm" | "md";
}) {
  return (
    <div className="flow-wrap" data-tone={tone} data-size={size} data-steps={steps.length}>
      <ol className="flow" aria-label={label}>
        {steps.map((s, i) => (
          <li key={i} className="flow-step">
            <span className="flow-idx meta" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flow-text">
              <span className="flow-label">{s.label}</span>
              <span className="flow-tool meta">{s.tool}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
