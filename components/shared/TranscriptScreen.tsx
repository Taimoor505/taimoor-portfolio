import type { Release } from "@/lib/data";
import "./flow-screen.css";
import "./transcript-screen.css";

// A second view of the same agent: the call log and the conversation behind the workflow.
// Reuses FlowScreen's frame classes so both windows read as one product. Decorative only.
export default function TranscriptScreen({ release }: { release: Release }) {
  const lines = release.transcript ?? [];

  return (
    <div className="fs-root ts-root" aria-hidden="true">
      <div className="fs-frame">
        <div className="fs-bar">
          <span className="fs-logo" />
          <span className="fs-name">{release.name}</span>
          <span className="fs-crumb">/ {release.kind} / calls</span>
          <span className="fs-spacer" />
          <span className="fs-status">
            <span className="fs-dot" data-state="live" />
            Live
          </span>
        </div>

        <div className="fs-body">
          <div className="ts-list">
            <p className="fs-side-label">Calls today</p>
            {["Pickup order", "Delivery order", "Menu question", "Pickup order"].map((t, i) => (
              <div key={i} className="ts-call" data-active={i === 0 ? "" : undefined}>
                <span className="ts-call-t">{t}</span>
                <span className="ts-call-m">{["01:12", "02:05", "00:48", "01:31"][i]}</span>
              </div>
            ))}
          </div>

          <div className="ts-chat">
            <div className="fs-toolbar">
              <span>
                <b>Example call</b> · transcript
              </span>
              <span>01:12</span>
            </div>
            <div className="ts-lines">
              {lines.map((l, i) => (
                <div key={i} className="ts-line" data-who={l.who}>
                  <span className="ts-who">{l.who === "agent" ? "Agent" : "Caller"}</span>
                  <p className="ts-text">{l.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
