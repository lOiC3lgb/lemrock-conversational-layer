/* ============================================================
   App.jsx — assemble le démonstrateur + signaux de gouvernance
   ============================================================ */
import { useEffect, useState, Fragment } from "react";
import { DEMO } from "./data/index.js";
import { usePresence } from "./store/store.js";
import { AgentMark } from "./components/AgentMark.jsx";
import { Article } from "./components/Article.jsx";
import { AmbientBubble } from "./components/AmbientBubble.jsx";
import { AgentPanel, LexicalPopover } from "./components/Agent.jsx";
import { ImmersivePanel } from "./components/ImmersivePanel.jsx";
import { ComplianceDock, LevelBadge, SuppressToast } from "./components/EventsPanel.jsx";

function IntroHint({ onDismiss }) {
  return (
    <div className="intro-hint glass" role="note">
      <AgentMark size={16} color="var(--accent)" />
      <span>Touchez les <span className="ih-term">termes soulignés</span>, continuez à scroller pour le compagnon, ou ouvrez-le en bas à droite.</span>
      <button onClick={onDismiss} aria-label="Fermer"><i className="ph ph-x" style={{ fontSize: 13 }}></i></button>
    </div>
  );
}

export function App() {
  const [state, store] = usePresence();
  const [intro, setIntro] = useState(true);

  // fixed config (the Tweaks panel was removed): keep the document attributes explicit
  useEffect(() => {
    document.documentElement.setAttribute("data-accent", "graphite");
    document.documentElement.setAttribute("data-reduced", state.reducedMotion ? "on" : "off");
  }, [state.reducedMotion]);

  // ---- N2 governance signals: scroll-threshold awake + precise dwell teaser ----
  useEffect(() => {
    const scroller = document.scrollingElement || document.documentElement;
    const segTeaser = {};
    DEMO.TEASERS.forEach((tz) => { segTeaser[tz.segmentId] = tz; });
    let idle = null;

    // the segment crossing the reader's "eye line" (≈40% down the viewport) —
    // far more precise than an intersection-ratio threshold for picking the
    // section actually being read
    const activeSegment = () => {
      const line = window.innerHeight * 0.4;
      let best = null, bestDist = Infinity;
      document.querySelectorAll("[data-seg]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const covers = r.top <= line && r.bottom >= line;
        const dist = covers ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
        if (dist < bestDist) { bestDist = dist; best = el.getAttribute("data-seg"); }
      });
      return best;
    };

    const onScroll = () => {
      const st = store.getState();
      const denom = scroller.scrollHeight - scroller.clientHeight;
      const frac = denom > 0 ? scroller.scrollTop / denom : 0;
      if (frac > st.gov.scrollAwakeThreshold) store.awake();
      clearTimeout(idle);
      idle = setTimeout(() => {
        const s = store.getState();
        if (document.hidden) return;
        if (s.agent || s.immersive || s.optedOut || !s.levels.N2) return;
        if (s.bubble !== "dormant" && s.bubble !== "awake") return;
        const seg = activeSegment();
        const tz = seg && segTeaser[seg];
        if (tz && !s.shownTeasers[tz.id]) store.surfaceTeaser(tz);
      }, store.getState().gov.dwellAwakeMs);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(idle); };
  }, []);

  // masque l'aide d'intro à la première interaction
  useEffect(() => {
    if (state.events.length > 0 && intro) setIntro(false);
  }, [state.events.length]);

  return (
    <Fragment>
      <Article state={state} store={store} />

      {/* surfaces de la couche */}
      {!state.agent && !state.immersive && <AmbientBubble state={state} store={store} />}
      <AgentPanel state={state} store={store} />
      <LexicalPopover state={state} store={store} />
      <ImmersivePanel state={state} store={store} />

      {/* gouvernance + chrome */}
      <ComplianceDock state={state} store={store} />
      <LevelBadge state={state} store={store} />
      <SuppressToast state={state} store={store} />

      {intro && <IntroHint onDismiss={() => setIntro(false)} />}
    </Fragment>
  );
}
