/* ============================================================
   App.jsx — assembles the demonstrator + governance signals + Tweaks
   ============================================================ */
import { useEffect, useState, Fragment } from "react";
import { DEMO } from "./data/index.js";
import { usePresence } from "./store/store.js";
import { useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakSlider } from "./components/TweaksPanel.jsx";
import { AgentMark } from "./components/AgentMark.jsx";
import { Article } from "./components/Article.jsx";
import { AmbientBubble } from "./components/AmbientBubble.jsx";
import { AgentPanel, LexicalPopover } from "./components/Agent.jsx";
import { ImmersivePanel } from "./components/ImmersivePanel.jsx";
import { ComplianceDock, LevelBadge, SuppressToast } from "./components/EventsPanel.jsx";

const TWEAK_DEFAULTS = {
  N1: true, N2: true, N3: true, N4: true, N5: true,
  maxSolicit: 4,
  cooldown: 6,
  dense: false,
  coral: false,
  reduced: false
};

function IntroHint({ onDismiss }) {
  return (
    <div className="intro-hint glass" role="note">
      <AgentMark size={16} color="var(--accent)" />
      <span>Tap <span className="ih-term">underlined terms</span>, keep scrolling for the companion, or open it bottom-right.</span>
      <button onClick={onDismiss} aria-label="Dismiss"><i className="ph ph-x" style={{ fontSize: 13 }}></i></button>
    </div>
  );
}

export function App() {
  const [state, store] = usePresence();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [intro, setIntro] = useState(true);

  // ---- Tweaks -> store + document attributes ----
  useEffect(() => {
    store.setConfig({
      levels: { N1: t.N1, N2: t.N2, N3: t.N3, N4: t.N4, N5: t.N5 },
      coralAccent: t.coral,
      reducedMotion: t.reduced,
      denseSegmentSim: t.dense
    });
    store.setGov({
      maxSolicitationsPerSession: t.maxSolicit,
      cooldownBetweenSolicitations: t.cooldown * 1000
    });
    document.documentElement.setAttribute("data-accent", t.coral ? "coral" : "graphite");
    document.documentElement.setAttribute("data-reduced", t.reduced ? "on" : "off");
  }, [t.N1, t.N2, t.N3, t.N4, t.N5, t.maxSolicit, t.cooldown, t.coral, t.reduced, t.dense]);

  // ---- N2 governance signals: scroll-threshold awake + dwell teaser ----
  useEffect(() => {
    const scroller = document.scrollingElement || document.documentElement;
    const segTeaser = {};
    DEMO.TEASERS.forEach((tz) => { segTeaser[tz.segmentId] = tz; });
    let current = null, idle = null;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting && en.intersectionRatio >= 0.5) current = en.target.getAttribute("data-seg"); });
    }, { threshold: [0.5] });
    const observe = () => document.querySelectorAll("[data-seg]").forEach((el) => io.observe(el));
    observe();

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
        const tz = current && segTeaser[current];
        if (tz && !s.shownTeasers[tz.id]) store.surfaceTeaser(tz);
      }, store.getState().gov.dwellAwakeMs);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); clearTimeout(idle); };
  }, []);

  // dismiss intro on first meaningful interaction
  useEffect(() => {
    if (state.events.length > 0 && intro) setIntro(false);
  }, [state.events.length]);

  return (
    <Fragment>
      <Article state={state} store={store} />

      {/* layer surfaces */}
      {!state.agent && !state.immersive && <AmbientBubble state={state} store={store} />}
      <AgentPanel state={state} store={store} />
      <LexicalPopover state={state} store={store} />
      <ImmersivePanel state={state} store={store} />

      {/* governance + instrumentation chrome */}
      <ComplianceDock state={state} store={store} />
      <LevelBadge state={state} store={store} />
      <SuppressToast state={state} store={store} />

      {intro && <IntroHint onDismiss={() => setIntro(false)} />}

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Presence levels" />
        <TweakToggle label="N1 · Lexical (inline terms)" value={t.N1} onChange={(v) => setTweak("N1", v)} />
        <TweakToggle label="N2 · Ambient (living bubble)" value={t.N2} onChange={(v) => setTweak("N2", v)} />
        <TweakToggle label="N3 · Contextual (modules)" value={t.N3} onChange={(v) => setTweak("N3", v)} />
        <TweakToggle label="N4 · Sponsored surfaces" value={t.N4} onChange={(v) => setTweak("N4", v)} />
        <TweakToggle label="N5 · Immersive takeover" value={t.N5} onChange={(v) => setTweak("N5", v)} />

        <TweakSection label="Attention governance" />
        <TweakSlider label="Solicitation budget / session" value={t.maxSolicit} min={1} max={8} step={1} onChange={(v) => setTweak("maxSolicit", v)} />
        <TweakSlider label="Cooldown between pushes" value={t.cooldown} min={0} max={15} step={1} unit="s" onChange={(v) => setTweak("cooldown", v)} />
        <TweakToggle label="Simulate dense native ads (watch section)" value={t.dense} onChange={(v) => setTweak("dense", v)} />

        <TweakSection label="Appearance" />
        <TweakToggle label="GBX coral accent" value={t.coral} onChange={(v) => setTweak("coral", v)} />
        <TweakToggle label="Reduced motion" value={t.reduced} onChange={(v) => setTweak("reduced", v)} />
      </TweaksPanel>
    </Fragment>
  );
}
