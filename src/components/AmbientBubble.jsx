/* ============================================================
   AmbientBubble.jsx — N2 (PRD §7.2)
   A living launcher that MORPHS open. One element transforms from the
   compact orb into a glass message card (dark blob → light card),
   surfacing a line tied to the segment you're currently reading.
   Never open at load. Breathes, never blinks, never blocks text.
   Stays a compact launcher (never a large sticky — Better Ads, §10).
   ============================================================ */
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { DEMO } from "../data/index.js";
import { AgentMark } from "./AgentMark.jsx";

const SEMI_ENTRIES = [
  { id: "e-watch", label: "Comparer 3 montres GPS", icon: "ph-watch", flowId: "flow-montre-compare" },
  { id: "e-plan", label: "Résumer le plan de 8 semaines", icon: "ph-list-checks", flowId: "flow-summarize-plan" },
  { id: "e-shoe", label: "Trouve ta chaussure", icon: "ph-sneaker-move", flowId: "flow-recommend-shoes" }
];

// ---- the contextual teaser card (revealed inside the morph) ----
function TeaserPanel({ teaser, store }) {
  return (
    <div className="bm-teaser">
      {teaser.sponsored && (
        <span className="bm-spon"><i className="ph-fill ph-megaphone-simple" style={{ fontSize: 10 }}></i> Sponsorisé</span>
      )}
      <div className="bm-teaser-head">
        <span className="bm-avatar"><AgentMark size={15} color="#fff" /></span>
        <button className="bm-line" onClick={() => store.acceptTeaser()}>{teaser.line}</button>
        <button className="bm-x" onClick={() => store.dismissTeaser()} aria-label="Ignorer"><i className="ph ph-x" style={{ fontSize: 13 }}></i></button>
      </div>
      <div className="bm-actions">
        <button className="bm-go" onClick={() => store.acceptTeaser()}>Voir <i className="ph ph-arrow-right" style={{ fontSize: 12 }}></i></button>
      </div>
    </div>
  );
}

// ---- the compact shortcut menu (revealed inside the morph) ----
function SemiPanel({ store, pickEntry }) {
  const [v, setV] = useState("");
  const submit = (e) => { e.preventDefault(); const t = v.trim(); if (!t) return; setV(""); store.openAgentQuery(t); };
  return (
    <div className="bm-semi">
      <div className="bm-semi-head">
        <span className="bm-avatar"><AgentMark size={13} color="#fff" /></span>
        <div className="bm-semi-titles">
          <div className="t1">Compagnon</div>
          <div className="t2">Là pour vous aider pendant la lecture</div>
        </div>
        <button className="bm-x" onClick={() => store.setBubble("dormant")} aria-label="Fermer"><i className="ph ph-x" style={{ fontSize: 14 }}></i></button>
      </div>
      <div className="bm-semi-list">
        {SEMI_ENTRIES.map((e) => (
          <button key={e.id} onClick={() => pickEntry(e)} className="semi-entry">
            <i className={"ph " + e.icon} style={{ fontSize: 17, color: "var(--ink-3)" }}></i>
            <span style={{ flex: 1, textAlign: "left", fontSize: 13.5, fontWeight: 600, color: "var(--ink-1)" }}>{e.label}</span>
            <i className="ph ph-arrow-up-right" style={{ fontSize: 14, color: "var(--ink-4)" }}></i>
          </button>
        ))}
      </div>
      <form className="bm-ask" onSubmit={submit}>
        <input className="bm-ask-input" value={v} onChange={(e) => setV(e.target.value)} placeholder="Écrire au compagnon…" aria-label="Écrire au compagnon" />
        <button type="submit" className="bm-ask-send" disabled={!v.trim()} aria-label="Envoyer"><i className="ph-fill ph-arrow-up" style={{ fontSize: 14 }}></i></button>
      </form>
    </div>
  );
}

export function AmbientBubble({ state, store }) {
  if (!state.levels.N2) return null;
  const b = state.bubble;
  const teaser = state.teaser;
  const reduced = state.reducedMotion;
  const retractRef = useRef(null);
  const panelRef = useRef(null);
  const [h, setH] = useState(null);

  const isOpen = b === "teaser" || b === "semiOpen";
  const collapsed = b === "dormant" || b === "awake";

  // measure the revealed content so the orb morphs to exactly its height
  useLayoutEffect(() => {
    if (isOpen && panelRef.current) setH(panelRef.current.scrollHeight + 2);
    else setH(null);
  }, [b, teaser && teaser.id]);

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

  const cls = "bubble-morph"
    + (b === "awake" ? " is-awake" : "")
    + (isOpen ? " is-open" : "")
    + (b === "semiOpen" ? " is-semi" : "")
    + (reduced ? " is-reduced" : "");

  return (
    <div className="bubble-root" aria-live="polite">
      <div
        className={cls}
        style={isOpen && h != null ? { height: h } : undefined}
        role={collapsed ? "button" : "dialog"}
        tabIndex={collapsed ? 0 : -1}
        aria-label={collapsed ? "Ouvrir le compagnon de lecture" : "Compagnon"}
        aria-expanded={b === "semiOpen"}
        onClick={collapsed ? onLauncherClick : undefined}
        onKeyDown={collapsed ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onLauncherClick(); } } : undefined}
      >
        <span className="bm-orb" aria-hidden="true"><AgentMark size={22} color="#fff" /></span>
        <div className="bm-panel" ref={panelRef} aria-hidden={collapsed}>
          {b === "teaser" && teaser && <TeaserPanel teaser={teaser} store={store} />}
          {b === "semiOpen" && <SemiPanel store={store} pickEntry={pickEntry} />}
        </div>
      </div>
      {b === "awake" && <span className="bubble-spark" aria-hidden="true"></span>}
    </div>
  );
}
