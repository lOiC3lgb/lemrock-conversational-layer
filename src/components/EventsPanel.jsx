/* ============================================================
   EventsPanel.jsx — governance / demo HUD (PRD §12, §10)
   - ComplianceDock: a compact "jump to level" menu (N1–N5) that triggers
     each presence level directly, plus the Better-Ads compliance badge.
   - LevelBadge: which level just acted (demo narration).
   - SuppressToast: shows when a push is suppressed (budget/cooldown/density/optout).
   ============================================================ */
import { useEffect } from "react";

const LEVELS = [
  { id: "N1", name: "Lexical" },
  { id: "N2", name: "Ambiant" },
  { id: "N2'", name: "Ambiant média", base: "N2" },
  { id: "N3", name: "Contextuel" },
  { id: "N4", name: "Sponsorisé" },
  { id: "N5", name: "Immersif" }
];

export function ComplianceDock({ state, store }) {
  // manual rAF smooth-scroll — uses instant scrollTo steps, so it works in every
  // context (including embeds that ignore behavior:"smooth"); honours reduced motion
  const smoothScrollTo = (targetY, done) => {
    if (state.reducedMotion) { window.scrollTo(0, targetY); done && done(); return; }
    const startY = window.scrollY, dist = targetY - startY;
    const dur = Math.min(620, Math.max(260, Math.abs(dist) * 0.5)), t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, startY + dist * ease(p));
      if (p < 1) requestAnimationFrame(step); else done && done();
    };
    requestAnimationFrame(step);
  };

  const scrollToEl = (el, cb) => {
    if (!el) { cb && cb(); return; }
    const r = el.getBoundingClientRect();
    const target = Math.max(0, window.scrollY + r.top - window.innerHeight / 2 + r.height / 2);
    smoothScrollTo(target, cb);
  };

  // each chip jumps straight to the matching presence level
  const jump = (level) => {
    if (level === "N5") {
      store.openImmersive({ kind: "comparator", flowId: "flow-montre-compare", segmentId: "seg-montre" });
      return;
    }
    // N1–N4 read on the article, so clear any takeover first
    if (state.immersive) store.closeImmersive();
    if (state.agent) store.closeAgent();

    if (level === "N1") {
      const el = document.querySelector('[data-term="term-dplus"]') || document.querySelector(".aug-term");
      scrollToEl(el, () => {
        if (!el) return;
        const termId = el.getAttribute("data-term") || "term-dplus";
        const r = el.getBoundingClientRect();
        store.openLexical(termId, { left: r.left, top: r.top, bottom: r.bottom, width: r.width });
      });
    } else if (level === "N2") {
      store.demoTeaser();
    } else if (level === "N2'") {
      store.demoMediaTeaser();
    } else if (level === "N3") {
      const el = document.querySelector('[data-seg="seg-montre"] .n3-module') || document.querySelector(".n3-module");
      scrollToEl(el, () => store.flashLevel("N3"));
    } else if (level === "N4") {
      const el = document.querySelector(".art-inline-ad") || document.querySelector('[data-seg="seg-nutrition"]');
      scrollToEl(el, () => store.flashLevel("N4"));
    }
  };

  return (
    <div className="compliance-dock">
      <div className="level-jump glass">
        <span className="lj-label">Aller au niveau</span>
        <div className="lj-chips">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              className="lj-chip"
              onClick={() => jump(l.id)}
              disabled={!state.levels[l.base || l.id]}
              title={l.id + " · " + l.name}
              aria-label={"Déclencher " + l.id + " " + l.name}
            >
              {l.id}
            </button>
          ))}
        </div>
      </div>
      <div className="dock-conformity glass" title="Conforme Better Ads">
        <i className="ph-fill ph-seal-check" style={{ fontSize: 14, color: "var(--success)" }}></i>
        <span>Conforme Better&nbsp;Ads</span>
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
  const NAMES = { N1: "Lexical", N2: "Ambiant", N3: "Contextuel", N4: "Sponsorisé", N5: "Immersif" };
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
    budget: "Budget d'attention atteint — plus de sollicitations cette session (le pull reste possible).",
    cooldown: "Temporisation entre sollicitations — supprimée.",
    density: "Densité publicitaire native trop élevée ici — la couche n'a rien ajouté.",
    optout: "Vous avez refusé — sollicitation supprimée."
  };
  return (
    <div className="suppress-toast" key={s.at}>
      <i className="ph ph-shield-check" style={{ fontSize: 15, color: "var(--success)" }}></i>
      <span>{MSG[s.reason] || "Suppressed"}</span>
    </div>
  );
}
