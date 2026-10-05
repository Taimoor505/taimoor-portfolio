import type { CSSProperties } from "react";
import type { Release } from "@/lib/data";
import "./flow-screen.css";

function Icon({ kind }: { kind: "start" | "step" | "end" }) {
  if (kind === "start")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    );
  if (kind === "end")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h12M12 6l6 6-6 6" />
    </svg>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function FlowScreen({ release, variant = "lg" }: { release: Release; variant?: "lg" | "sm" }) {
  const steps = release.flow;
  const n = steps.length;
  const building = release.status === "In build";
  // "Shipped" duplicates the status pill, so such releases show the stack footer instead.
  const result = release.result && release.result.value !== "Shipped" ? release.result : undefined;

  return (
    <div
      className="fs-root"
      data-variant={variant}
      data-steps={n}
      role="img"
      aria-label={`${release.name} workflow: ${steps.map((s) => `${s.label} (${s.tool})`).join(", then ")}`}
    >
      <div className="fs-frame" aria-hidden="true">
        <div className="fs-bar">
          <span className="fs-logo" />
          <span className="fs-name">{release.name}</span>
          <span className="fs-crumb">/ {release.kind} / workflow</span>
          <span className="fs-spacer" />
          <span className="fs-status">
            <span className="fs-dot" data-state={building ? "build" : "live"} />
            {building ? "In build" : "Shipped"}
          </span>
        </div>

        <div className="fs-body">
          {variant === "lg" && (
            <div className="fs-side">
              <p className="fs-side-label">Workflow</p>
              {steps.map((s, i) => (
                <div key={i} className="fs-side-item" data-active={i === 0 ? "" : undefined}>
                  <span className="fs-side-idx">{pad(i + 1)}</span>
                  <span>{s.label}</span>
                </div>
              ))}
              <div className="fs-side-gap" />
              <p className="fs-side-label">Stack</p>
              {release.stack.slice(0, 4).map((t) => (
                <div key={t} className="fs-side-item">
                  <span className="fs-chip-sq" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}

          <div className="fs-canvas">
            {variant === "lg" && (
              <div className="fs-toolbar">
                <span>
                  <b>{n} steps</b> · {release.version}
                </span>
                <span>{release.date}</span>
              </div>
            )}

            <div className="fs-flow">
              {steps.map((s, i) => {
                const first = i === 0;
                const last = i === n - 1;
                return (
                  <div
                    key={i}
                    className="fs-node"
                    data-first={first ? "" : undefined}
                    data-last={last ? "" : undefined}
                    style={{ animationDelay: `${150 + i * 90}ms` }}
                  >
                    <div className="fs-node-head">
                      <span className="fs-icon">
                        <Icon kind={first ? "start" : last ? "end" : "step"} />
                      </span>
                      <span className="fs-idx">{pad(i + 1)}</span>
                    </div>
                    <p className="fs-label">{s.label}</p>
                    <span className="fs-tool">{s.tool}</span>
                    {!last && <span className="fs-link" style={{ "--fs-delay": `${i * 0.7}s` } as CSSProperties} />}
                  </div>
                );
              })}
            </div>

            <div className="fs-foot">
              {result ? (
                <>
                  <span className="fs-foot-k">Result</span>
                  <span className="fs-foot-v">{result.value}</span>
                  <span className="fs-foot-l">{result.label}</span>
                </>
              ) : (
                <>
                  <span className="fs-foot-k">Stack</span>
                  <span className="fs-foot-l">{release.stack.join(" · ")}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
