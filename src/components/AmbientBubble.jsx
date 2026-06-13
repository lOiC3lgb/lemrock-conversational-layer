/* ============================================================
   AmbientBubble.jsx — N2 (PRD §7.2)
   A living launcher: dormant -> awake -> teaser -> semiOpen -> open.
   Never open at load. Breathes (morph), never blinks, never blocks text.
   Stays a compact launcher (never a large sticky — Better Ads, §10).
   ============================================================ */
import { useEffect, useRef } from "react";
import { DEMO } from "../data/index.js";
import { AgentMark } from "./AgentMark.jsx";

const SEMI_ENTRIES = [
  { id: "e-watch", label: "Compare 3 GPS watches", icon: "ph-watch", flowId: "flow-montre-compare" },
  { id: "e-plan", label: "Summarize the 8-week plan", icon: "ph-list-checks", flowId: "flow-summarize-plan" },
  { id: "e-shoe", label: "Find your shoe", icon: "ph-sneaker-move", flowId: "flow-recommend-shoes" }
];

export function AmbientBubble({ state, store }) {
  if (!state.levels.N2) return null;
  const b = state.bubble;
  const teaser = state.teaser;
  const retractRef = useRef(null);

  // teaser auto-retract if ignored (PRD §7.2)
  useEffect(() => {
    if (b === "teaser") {
      retractRef.current = setTimeout(() => store.dismissTeaser(), 7000);
      return () => clearTimeout(retractRef.current);
    }
  }, [b, teaser && teaser.id]);

  // emit state changes for instrumentation
  const prev = useRef(b);
  useEffect(() => {
    if (prev.current !== b) {
      store.emit("level.state.change", { level: "N2", from: prev.current, to: b });
      prev.current = b;
    }
  }, [b]);

  const onLauncherClick = () => {
    if (b === "semiOpen") { store.setBubble("dormant"); return; }
    store.openSemi(); // pull is always allowed, even when opted out
  };

  const pickEntry = (entry) => {
    const f = DEMO.FLOWS[entry.flowId];
    if (f && f.immersive) store.openImmersive({ kind: f.immersive, flowId: entry.flowId, segmentId: null });
    else store.openAgent({ flowId: entry.flowId, triggerSource: "semi", segmentId: null });
  };

  const reduced = state.reducedMotion;

  return (
    <div className="bubble-root" aria-live="polite">
      {/* TEASER — one contextual line */}
      {b === "teaser" && teaser && (
        <div className="bubble-teaser glass" role="status">
          {teaser.sponsored && (
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--sponsored-fg)", background: "var(--sponsored-bg)", border: "1px solid var(--sponsored-line)", padding: "1px 7px", borderRadius: "999px", alignSelf: "flex-start", marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <i className="ph-fill ph-megaphone-simple" style={{ fontSize: 10 }}></i> Sponsored
            </span>
          )}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
            <AgentMark size={15} color="var(--accent)" />
            <button onClick={() => store.acceptTeaser()} style={{ flex: 1, textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: 0, font: "inherit" }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)", lineHeight: 1.35 }}>{teaser.line}</span>
            </button>
            <button onClick={() => store.dismissTeaser()} style={teaserClose} aria-label="Dismiss"><i className="ph ph-x" style={{ fontSize: 13 }}></i></button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, paddingLeft: 24 }}>
            <button onClick={() => store.acceptTeaser()} style={teaserGo}>Show me <i className="ph ph-arrow-right" style={{ fontSize: 12 }}></i></button>
          </div>
        </div>
      )}

      {/* SEMI-OPEN — compact menu of entries (not the full chat) */}
      {b === "semiOpen" && (
        <div className="bubble-semi glass" role="dialog" aria-label="Companion shortcuts">
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 14px 9px" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}><AgentMark size={13} color="#fff" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--ink-1)" }}>Companion</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Here to help while you read</div>
            </div>
            <button onClick={() => store.setBubble("dormant")} style={teaserClose} aria-label="Close"><i className="ph ph-x" style={{ fontSize: 14 }}></i></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "2px 10px 12px" }}>
            {SEMI_ENTRIES.map((e) => (
              <button key={e.id} onClick={() => pickEntry(e)} className="semi-entry">
                <i className={"ph " + e.icon} style={{ fontSize: 17, color: "var(--ink-3)" }}></i>
                <span style={{ flex: 1, textAlign: "left", fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>{e.label}</span>
                <i className="ph ph-arrow-up-right" style={{ fontSize: 14, color: "var(--ink-4)" }}></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LAUNCHER — always present (dormant/awake). Compact. */}
      <button
        onClick={onLauncherClick}
        className={"bubble-launcher" + (b === "awake" ? " is-awake" : "") + (reduced ? " no-morph" : "")}
        aria-label="Open reading companion"
        aria-expanded={b === "semiOpen"}
      >
        <span className="bubble-orb">
          <AgentMark size={22} color="#fff" />
        </span>
        {b === "awake" && <span className="bubble-spark" aria-hidden="true"></span>}
      </button>
    </div>
  );
}

const teaserClose = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", border: "none", background: "transparent", color: "var(--ink-4)", cursor: "pointer", flexShrink: 0 };
const teaserGo = { display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-agent)", fontSize: 12.5, fontWeight: 600, color: "#fff", background: "var(--accent)", border: "none", borderRadius: "999px", padding: "7px 13px", cursor: "pointer" };
