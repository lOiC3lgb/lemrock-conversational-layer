/* ============================================================
   ContextualModule.jsx — N3 (PRD §7.3)
   Lives in the document flow (not an overlay). Reveals when its anchor
   crosses the visibility threshold. Reserves space => no layout shift (CLS).
   Polymorphic: recommend | compare | summarize. One per segment.
   ============================================================ */
import { useRef, useEffect, useState } from "react";
import { DEMO } from "../data/index.js";
import { AgentMark } from "./AgentMark.jsx";

const TYPE_META = {
  recommend: { icon: "ph-sneaker-move", verb: "Find" },
  compare: { icon: "ph-scales", verb: "Compare" },
  summarize: { icon: "ph-list-checks", verb: "Summarize" }
};

export function ContextualModule({ module, segmentId, state, store }) {
  if (!state.levels.N3) return null;
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const moduleId = segmentId + ":" + module.type;
  const hero = !!module.hero;

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.intersectionRatio >= (state.gov.moduleViewportThreshold || 0.6) && !shown) {
          setShown(true);
          store.moduleShown(moduleId, module.type, segmentId);
          io.disconnect();
        }
      });
    }, { threshold: [0, 0.3, 0.6, 0.9] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [shown]);

  const meta = TYPE_META[module.type] || TYPE_META.recommend;
  const offers = (module.offerIds || []).map((id) => DEMO.OFFERS[id]).filter(Boolean);
  const hasSponsored = offers.some((o) => o.kind === "sponsored");
  const reduced = state.reducedMotion;

  const activate = () => store.moduleActivated(module, segmentId);

  // reserve space to avoid CLS; reveal content on intersection
  return (
    <div ref={ref} className="n3-anchor" style={{ minHeight: hero ? 168 : 124 }}>
      <div className={"n3-module" + (shown ? " is-in" : "") + (reduced ? " no-anim" : "") + (hero ? " is-hero" : "")}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
          <span style={{ display: "inline-flex", width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", alignItems: "center", justifyContent: "center" }}>
            <AgentMark size={12} color="#fff" />
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--ink-3)" }}>Companion · from this section</span>
          {hasSponsored && (
            <span style={{ marginLeft: "auto", fontSize: 9.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--sponsored-fg)", background: "var(--sponsored-bg)", border: "1px solid var(--sponsored-line)", padding: "1px 7px", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <i className="ph-fill ph-megaphone-simple" style={{ fontSize: 10 }}></i> Includes sponsored
            </span>
          )}
        </div>

        <button onClick={activate} className="n3-cta" style={{ width: "100%" }}>
          <span style={{ display: "inline-flex", width: hero ? 46 : 38, height: hero ? 46 : 38, flexShrink: 0, borderRadius: "12px", background: "var(--accent-wash)", border: "1px solid var(--accent-ring)", alignItems: "center", justifyContent: "center" }}>
            <i className={"ph " + meta.icon} style={{ fontSize: hero ? 24 : 20, color: "var(--accent-soft)" }}></i>
          </span>
          <span style={{ flex: 1, textAlign: "left" }}>
            <span style={{ display: "block", fontWeight: 700, fontSize: hero ? 18 : 15.5, color: "var(--ink-1)", lineHeight: 1.25 }}>{module.label}</span>
            <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
              {module.type === "compare" ? "Side-by-side, sponsored options flagged" : module.type === "recommend" ? "A few questions, then a pick that fits" : "The key points in 20 seconds"}
            </span>
          </span>
          <span className="n3-go"><i className="ph ph-arrow-right" style={{ fontSize: 16 }}></i></span>
        </button>

        {/* preview strip for compare/recommend */}
        {offers.length > 0 && module.type === "compare" && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {offers.map((o) => (
              <div key={o.offerId} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--surface)", minWidth: 0 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: `linear-gradient(135deg, ${o.swatch[0]}, ${o.swatch[1]})`, flexShrink: 0 }}></span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.brand}</span>
                {o.kind === "sponsored" && <i className="ph-fill ph-megaphone-simple" title="Sponsored" style={{ fontSize: 11, color: "var(--sponsored-fg)", marginLeft: "auto" }}></i>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
