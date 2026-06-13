/* ============================================================
   Agent.jsx — shared conversation surface (PRD §7.0.1)
   Followups, AgentPanel (docked), LexicalPopover (N1).
   The agent recedes behind the article: glassy, neutral, distinct from
   editorial serif text.
   ============================================================ */
import { useRef, useEffect, useState } from "react";
import { DEMO } from "../data/index.js";
import { AgentMark, Avatar } from "./AgentMark.jsx";
import { Conversation, flowToNode } from "./Chat.jsx";
import { SponsoredFrame } from "./SponsoredFrame.jsx";

// ---- numbered suggested follow-up rows (reference look) ----
export function Followups({ ids, onPick, withInput = true }) {
  const flows = (ids || []).map((id) => DEMO.FLOWS[id]).filter(Boolean);
  if (!flows.length && !withInput) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {flows.length > 0 && (
        <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-3)", letterSpacing: ".02em", margin: "2px 0 0" }}>Suggested follow-ups</div>
      )}
      {flows.map((f, i) => (
        <button key={f.flowId} onClick={() => onPick(f.flowId)} className="fu-row" style={fuRow}>
          <span style={fuIcon}><i className="ph ph-arrow-bend-down-right" style={{ fontSize: 15 }} aria-hidden="true"></i></span>
          <span style={{ flex: 1, textAlign: "left" }}>
            <span style={{ display: "block", fontWeight: 600, fontSize: 13.5, color: "var(--ink-1)" }}>{f.title}</span>
          </span>
          <span style={fuNum}>{i + 1}</span>
        </button>
      ))}
      {withInput && (
        <div style={{ ...fuRow, cursor: "text", background: "var(--surface)" }}>
          <span style={fuIcon}><i className="ph ph-pencil-simple" style={{ fontSize: 15 }} aria-hidden="true"></i></span>
          <input placeholder="Ask a follow-up…" style={fuInput}
            onKeyDown={(e) => { if (e.key === "Enter" && e.target.value.trim()) { e.target.value = ""; } }} />
          <span style={{ ...fuNum, opacity: .5 }}>{flows.length + 1}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
//  DOCKED AGENT PANEL — from teaser / module / semiOpen
// ============================================================
export function AgentPanel({ state, store }) {
  const a = state.agent;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") store.closeAgent(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!a) return null;

  return (
    <div className="agent-dock" role="dialog" aria-label="Reading companion">
      <div className="glass agent-card">
        <header style={agentHead}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Avatar />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)" }}>Companion</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{labelFor(a.triggerSource)}</div>
            </div>
          </div>
          <button onClick={() => store.closeAgent()} style={iconBtn} aria-label="Close">
            <i className="ph ph-x" style={{ fontSize: 16 }}></i>
          </button>
        </header>
        <Conversation resolve={flowToNode} startId={a.flowId} store={store} key={a.flowId} />
      </div>
    </div>
  );
}

function labelFor(src) {
  return ({ term: "From a term you tapped", teaser: "Suggested while reading", module: "From this section", cta: "You asked", semi: "You opened me" })[src] || "Reading companion";
}

// ============================================================
//  N1 LEXICAL POPOVER — anchored beside the passage
// ============================================================
export function LexicalPopover({ state, store }) {
  const lx = state.lexical;
  const ref = useRef(null);
  const [pos, setPos] = useState(null);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;

  useEffect(() => {
    if (!lx) return;
    const onKey = (e) => { if (e.key === "Escape") store.closeLexical(); };
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) store.closeLexical(); };
    window.addEventListener("keydown", onKey);
    setTimeout(() => window.addEventListener("mousedown", onDown), 0);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("mousedown", onDown); };
  }, [lx]);

  useEffect(() => {
    if (!lx || isMobile) { setPos(null); return; }
    const W = 340, margin = 12;
    let left = lx.rect.left + lx.rect.width / 2 - W / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - W - margin));
    let top = lx.rect.bottom + 10;
    const flipUp = top + 220 > window.innerHeight;
    setPos({ left, top, flipUp, bottom: window.innerHeight - lx.rect.top + 10, W });
  }, [lx]);

  if (!lx) return null;
  const term = DEMO.TERMS[lx.termId];
  const flow = DEMO.FLOWS[term.flowId];
  const offer = term.offerRef ? DEMO.OFFERS[term.offerRef] : null;

  const pick = (id) => {
    const f = DEMO.FLOWS[id];
    if (f && f.immersive) store.openImmersive({ kind: f.immersive, flowId: id, segmentId: term.segmentId });
    else store.openAgent({ flowId: id, triggerSource: "term", segmentId: term.segmentId });
  };
  const onOfferCta = () => store.openAgent({ flowId: term.flowId, triggerSource: "term", segmentId: term.segmentId });

  const body = (
    <div ref={ref} className="glass lex-pop" role="dialog" aria-label={"About " + term.surface}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <AgentMark size={14} color="var(--accent)" />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--ink-3)" }}>{term.surface}</span>
        <button onClick={() => store.closeLexical()} style={{ ...iconBtn, marginLeft: "auto" }} aria-label="Close"><i className="ph ph-x" style={{ fontSize: 14 }}></i></button>
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-2)" }}>{flow.message}</div>
      {offer && (
        <div style={{ marginTop: 11 }}><SponsoredFrame offer={offer} variant="mini" onCta={onOfferCta} /></div>
      )}
      {flow.suggestedFollowups && flow.suggestedFollowups.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 11 }}>
          {flow.suggestedFollowups.map((id) => (
            <button key={id} onClick={() => pick(id)} style={chip}>
              {DEMO.FLOWS[id].title}<i className="ph ph-arrow-right" style={{ fontSize: 12, marginLeft: 4 }}></i>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="lex-sheet-wrap" onMouseDown={(e) => { if (e.target === e.currentTarget) store.closeLexical(); }}>
        <div className="lex-sheet">{body}</div>
      </div>
    );
  }
  if (!pos) return null;
  return (
    <div style={{ position: "fixed", left: pos.left, [pos.flipUp ? "bottom" : "top"]: pos.flipUp ? pos.bottom : pos.top, width: pos.W, zIndex: 80 }} className="lex-anchored">
      {body}
    </div>
  );
}

// ---- shared inline styles ----
const agentHead = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 8px" };
const iconBtn = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", border: "none", background: "transparent", color: "var(--ink-3)", cursor: "pointer" };
const fuRow = { display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "11px 12px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", transition: "border-color var(--t-fast), box-shadow var(--t-fast)", boxShadow: "var(--shadow-1)" };
const fuIcon = { display: "inline-flex", color: "var(--ink-3)" };
const fuNum = { fontSize: 11.5, fontWeight: 600, color: "var(--ink-4)", border: "1px solid var(--border)", borderRadius: "6px", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const fuInput = { flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-agent)", fontSize: 13.5, color: "var(--ink-1)" };
const chip = { display: "inline-flex", alignItems: "center", fontFamily: "var(--font-agent)", fontSize: 12.5, fontWeight: 600, color: "var(--accent-soft)", background: "var(--accent-wash)", border: "1px solid var(--accent-ring)", borderRadius: "999px", padding: "6px 11px", cursor: "pointer" };
