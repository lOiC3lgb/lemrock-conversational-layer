/* ============================================================
   ImmersivePanel.jsx — N5 (PRD §7.5) — conversation-first
   Earned takeover after an explicit action. The article recedes
   (dimmed, never destroyed). The whole experience is a guided
   conversation (finder / comparator), not a form or a table.
   Closing restores the exact reading position.
   ============================================================ */
import { useEffect } from "react";
import { AgentMark } from "./AgentMark.jsx";
import { Conversation, convResolver } from "./Chat.jsx";

const TITLES = {
  finder: { t: "Trouve ta chaussure", i: "ph-sneaker-move" },
  comparator: { t: "Comparer les montres GPS", i: "ph-scales" }
};

export function ImmersivePanel({ state, store }) {
  const im = state.immersive;
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") store.closeImmersive(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (im) store.emit("level.state.change", { level: "N5", from: "opening", to: "conversation" });
  }, [im && im.kind]);

  if (!im) return null;
  const meta = TITLES[im.kind] || TITLES.finder;

  return (
    <div className={"n5-wrap" + (state.reducedMotion ? " no-anim" : "")}>
      <div className="n5-scrim" onMouseDown={() => store.closeImmersive()}></div>
      <div className="n5-panel glass" role="dialog" aria-label={meta.t}>
        <header className="n5-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AgentMark size={16} color="#fff" />
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--ink-1)" }}>{meta.t}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Conversation · votre article est en pause derrière</div>
            </div>
          </div>
          <button onClick={() => store.closeImmersive()} className="n5-back">
            <i className="ph ph-arrow-u-down-left" style={{ fontSize: 15 }}></i> Retour à la lecture
          </button>
        </header>
        <Conversation resolve={convResolver(im.kind)} startId="start" store={store} key={im.kind} />
      </div>
    </div>
  );
}
