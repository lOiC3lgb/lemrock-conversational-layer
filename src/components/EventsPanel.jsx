/* ============================================================
   EventsPanel.jsx — instrumentation + governance UI (PRD §12, §10)
   - ComplianceDock: opt-out (one gesture), events toggle, session budget
   - EventsPanel: live taxonomy stream (proof of measurement)
   - LevelBadge: which level just acted (demo narration)
   - SuppressToast: shows when a push is suppressed (budget/cooldown/density/optout)
   ============================================================ */
import { useState, useEffect } from "react";

const EV_COLOR = (name) => {
  if (name.startsWith("level")) return "#6b6b64";
  if (name.startsWith("agent")) return "var(--accent)";
  if (name.startsWith("teaser")) return "#3b82f6";
  if (name.startsWith("module")) return "#1f9d55";
  if (name.startsWith("sponsored")) return "var(--sponsored-fg)";
  if (name.startsWith("optout")) return "#7a5af0";
  if (name.startsWith("solicitation")) return "#e0892f";
  return "var(--ink-3)";
};
const ago = (ts) => { const d = Math.max(0, Date.now() - ts); return d < 1000 ? "now" : Math.floor(d / 1000) + "s"; };
const detail = (e) => {
  const bits = [];
  if (e.level) bits.push(e.level);
  if (e.from && e.to) bits.push(e.from + "→" + e.to);
  if (e.triggerSource) bits.push(e.triggerSource);
  if (e.type) bits.push(e.type);
  if (e.flowId) bits.push(e.flowId.replace("flow-", ""));
  if (e.offerId) bits.push(e.offerId.replace("off-", ""));
  if (e.reason) bits.push(e.reason);
  if (e.termId) bits.push(e.termId.replace("term-", ""));
  if (typeof e.hasOffer === "boolean") bits.push(e.hasOffer ? "+offer" : "");
  return bits.filter(Boolean).join(" · ");
};

function EventsPanel({ state, store, open, onClose }) {
  if (!open) return null;
  const used = state.solicitations, max = state.gov.maxSolicitationsPerSession;
  return (
    <div className="events-panel glass thin-scroll" role="dialog" aria-label="Event log">
      <div className="events-head">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ph ph-pulse" style={{ fontSize: 16, color: "var(--accent)" }}></i>
          <strong style={{ fontSize: 13, color: "var(--ink-1)" }}>Event stream</strong>
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{state.events.length}</span>
        </div>
        <button onClick={onClose} style={evClose} aria-label="Close events"><i className="ph ph-x" style={{ fontSize: 14 }}></i></button>
      </div>
      <div className="events-meters">
        <div className="meter">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: "var(--ink-3)" }}>Attention budget</span>
            <span style={{ color: "var(--ink-1)", fontWeight: 700 }}>{used}/{max}</span>
          </div>
          <div className="meter-track"><div className="meter-fill" style={{ width: Math.min(100, (used / max) * 100) + "%", background: used >= max ? "#e0892f" : "var(--accent)" }}></div></div>
        </div>
      </div>
      <div className="events-list thin-scroll">
        {state.events.length === 0 && <div style={{ fontSize: 12.5, color: "var(--ink-3)", padding: "16px 4px", textAlign: "center" }}>Interact with the article — events appear here.</div>}
        {state.events.map((e, i) => (
          <div key={i} className="ev-row" style={{ opacity: i === 0 ? 1 : Math.max(0.45, 1 - i * 0.03) }}>
            <span className="ev-dot" style={{ background: EV_COLOR(e.event) }}></span>
            <span className="ev-name" style={{ color: EV_COLOR(e.event) }}>{e.event}</span>
            <span className="ev-detail">{detail(e)}</span>
            <span className="ev-time">{ago(e.ts)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComplianceDock({ state, store }) {
  const [evOpen, setEvOpen] = useState(false);
  return (
    <div className="compliance-dock">
      <EventsPanel state={state} store={store} open={evOpen} onClose={() => setEvOpen(false)} />
      <div className="dock-pills glass">
        <button onClick={() => setEvOpen((v) => !v)} className={"dock-btn" + (evOpen ? " on" : "")} aria-pressed={evOpen}>
          <i className="ph ph-pulse" style={{ fontSize: 15 }}></i>
          <span>Events</span>
          {state.events.length > 0 && <span className="dock-count">{state.events.length}</span>}
        </button>
        <span className="dock-sep"></span>
        <button onClick={() => store.toggleOptOut()} className={"dock-btn" + (state.optedOut ? " muted" : "")} aria-pressed={state.optedOut}>
          <i className={"ph " + (state.optedOut ? "ph-bell-slash" : "ph-bell-simple")} style={{ fontSize: 15 }}></i>
          <span>{state.optedOut ? "Opted out" : "Don't solicit me"}</span>
        </button>
      </div>
      <div className="dock-conformity glass" title="Better Ads compliant">
        <i className="ph-fill ph-seal-check" style={{ fontSize: 14, color: "var(--success)" }}></i>
        <span>Better&nbsp;Ads compliant</span>
      </div>
    </div>
  );
}

export function LevelBadge({ state, store }) {
  const lv = state.activeLevelBadge;
  useEffect(() => {
    if (!lv) return;
    const t = setTimeout(() => store.clearBadge(), 1900);
    return () => clearTimeout(t);
  }, [lv, state.events.length]);
  if (!lv) return null;
  const NAMES = { N1: "Lexical", N2: "Ambient", N3: "Contextual", N4: "Sponsored", N5: "Immersive" };
  return (
    <div className="level-badge" key={lv + state.events.length}>
      <span className="lb-tag">{lv}</span>
      <span className="lb-name">{NAMES[lv]}</span>
    </div>
  );
}

export function SuppressToast({ state, store }) {
  const s = state.lastSuppressed;
  useEffect(() => {
    if (!s) return;
    const t = setTimeout(() => store.clearSuppressed(), 2600);
    return () => clearTimeout(t);
  }, [s && s.at]);
  if (!s) return null;
  const MSG = {
    budget: "Attention budget reached — no more pushes this session (pull still works).",
    cooldown: "Cooling down between prompts — suppressed.",
    density: "Native ad density too high here — layer added nothing.",
    optout: "You opted out — push suppressed."
  };
  return (
    <div className="suppress-toast" key={s.at}>
      <i className="ph ph-shield-check" style={{ fontSize: 15, color: "var(--success)" }}></i>
      <span>{MSG[s.reason] || "Suppressed"}</span>
    </div>
  );
}

const evClose = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", border: "none", background: "transparent", color: "var(--ink-3)", cursor: "pointer" };
