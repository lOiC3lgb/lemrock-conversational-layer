/* ============================================================
   store.js — PresenceController + governance + event bus
   The single source of truth (PRD §11). Exposes usePresence().
   ============================================================ */
import { useSyncExternalStore } from "react";
import { DEMO } from "../data/index.js";

function createStore() {
  const listeners = new Set();

  let state = {
    // config (mutable via Tweaks)
    levels: { ...DEMO.CONFIG.levels.enabled },
    agentMode: DEMO.CONFIG.agentMode,
    gov: { ...DEMO.CONFIG.governance },
    coralAccent: false,
    reducedMotion: false,
    denseSegmentSim: false,        // tweak: simulate native-ad over-density on seg-montre

    // governance runtime
    optedOut: false,
    solicitations: 0,
    lastSolicitationAt: 0,

    // N1 lexical
    lexical: null,                 // { termId, rect }
    consultedTerms: {},            // termId -> true

    // N2 ambient bubble
    bubble: "dormant",             // dormant|awake|teaser|semiOpen
    teaser: null,                  // teaser object currently surfaced
    shownTeasers: {},              // id -> true

    // N3 modules
    shownModules: {},              // moduleId -> true

    // agent (shared conversation surface)
    agent: null,                   // { flowId, context, triggerSource }

    // N5 immersive
    immersive: null,               // { kind, flowId }
    readingAnchor: 0,

    // instrumentation
    events: [],
    lastSuppressed: null,          // { reason } for a brief toast

    activeLevelBadge: null         // which level just acted (for the HUD)
  };

  function notify() { listeners.forEach((l) => l()); }
  function set(patch) {
    state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
    notify();
  }

  function emit(event, payload) {
    const e = {
      event, ...payload,
      articleId: DEMO.ARTICLE.articleId,
      ts: Date.now()
    };
    state = { ...state, events: [e, ...state.events].slice(0, 80) };
    notify();
    return e;
  }

  function nativeDensity(segId) {
    const seg = DEMO.SEGMENTS.find((s) => s.id === segId);
    let d = seg ? seg.nativeAdDensity : 0;
    if (state.denseSegmentSim && segId === "seg-montre") d = 0.25;
    return d;
  }

  const api = {
    getState: () => state,
    subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
    emit,

    // ---- config / tweaks ----
    setConfig(patch) { set(patch); },
    setLevel(level, on) { set((s) => ({ levels: { ...s.levels, [level]: on } })); },
    setGov(patch) { set((s) => ({ gov: { ...s.gov, ...patch } })); },

    // ---- governance ----
    canSolicit() {
      const s = state;
      if (s.optedOut) return { ok: false, reason: "optout" };
      if (s.solicitations >= s.gov.maxSolicitationsPerSession) return { ok: false, reason: "budget" };
      if (Date.now() - s.lastSolicitationAt < s.gov.cooldownBetweenSolicitations) return { ok: false, reason: "cooldown" };
      return { ok: true };
    },
    registerSolicitation() {
      set((s) => ({ solicitations: s.solicitations + 1, lastSolicitationAt: Date.now() }));
    },
    suppress(reason) {
      emit("solicitation.suppressed", { reason });
      set({ lastSuppressed: { reason, at: Date.now() } });
    },
    clearSuppressed() { set({ lastSuppressed: null }); },

    canShowMonetized(segId) {
      const layerContribution = 0.12;
      const cap = state.gov.nativeDensityCap;
      return nativeDensity(segId) + layerContribution <= cap;
    },
    nativeDensity,

    // ---- opt-out (PRD §7.0.3) ----
    toggleOptOut() {
      set((s) => ({ optedOut: !s.optedOut, bubble: !s.optedOut ? "dormant" : s.bubble, teaser: null }));
      emit("optout.toggle", { scope: "article", value: state.optedOut });
    },

    // ---- N1 lexical ----
    openLexical(termId, rect) {
      if (!state.levels.N1) return;
      set((s) => ({ lexical: { termId, rect }, consultedTerms: { ...s.consultedTerms, [termId]: true }, activeLevelBadge: "N1" }));
      const term = DEMO.TERMS[termId];
      emit("agent.open", { triggerSource: "term", segmentId: term.segmentId, termId });
    },
    closeLexical() { set({ lexical: null }); },

    // ---- N2 ambient bubble ----
    setBubble(next, teaser) {
      set({ bubble: next, teaser: teaser !== undefined ? teaser : state.teaser });
    },
    awake() {
      if (!state.levels.N2 || state.optedOut) return false;
      if (state.bubble === "dormant") { set({ bubble: "awake", activeLevelBadge: "N2" }); return true; }
      return false;
    },
    surfaceTeaser(teaser) {
      const gate = api.canSolicit();
      if (!gate.ok) { api.suppress(gate.reason); set({ bubble: "dormant" }); return false; }
      if (state.shownTeasers[teaser.id]) return false;
      api.registerSolicitation();
      set((s) => ({ bubble: "teaser", teaser, shownTeasers: { ...s.shownTeasers, [teaser.id]: true }, activeLevelBadge: "N2" }));
      emit("teaser.shown", { teaserId: teaser.id, segmentId: teaser.segmentId, sponsored: teaser.sponsored });
      return true;
    },
    dismissTeaser() {
      if (state.teaser) emit("teaser.dismissed", { teaserId: state.teaser.id });
      set({ bubble: "dormant", teaser: null });
    },
    acceptTeaser() {
      const t = state.teaser;
      if (!t) return;
      emit("teaser.accepted", { teaserId: t.id });
      api.openAgent({ flowId: t.flowId, triggerSource: "teaser", segmentId: t.segmentId });
      set({ bubble: "dormant", teaser: null });
    },
    openSemi() {
      if (!state.levels.N2) return;
      set({ bubble: "semiOpen", activeLevelBadge: "N2" });
    },

    // ---- shared agent ----
    openAgent({ flowId, triggerSource, segmentId, termId }) {
      const flow = DEMO.FLOWS[flowId];
      set({ agent: { flowId, triggerSource, segmentId, termId }, lexical: null, bubble: "dormant", activeLevelBadge: triggerSource === "term" ? "N1" : "N2" });
      emit("agent.open", { triggerSource, segmentId, termId });
      if (flow) emit("agent.response", { flowId, hasOffer: !!flow.offerRef });
      // chained immersive (N5) is launched by the agent UI on user action, not here
    },
    closeAgent() { set({ agent: null }); },

    // ---- N3 modules ----
    moduleShown(moduleId, type, segmentId) {
      if (state.shownModules[moduleId]) return;
      const gate = api.canSolicit();
      if (!gate.ok) { api.suppress(gate.reason); return; }
      api.registerSolicitation();
      set((s) => ({ shownModules: { ...s.shownModules, [moduleId]: true }, activeLevelBadge: "N3" }));
      emit("module.shown", { moduleId, type, segmentId });
    },
    moduleActivated(module, segmentId) {
      emit("module.activated", { type: module.type, segmentId });
      const flow = DEMO.FLOWS[module.flowId];
      if (flow && flow.immersive) {
        api.openImmersive({ kind: flow.immersive, flowId: module.flowId, segmentId });
      } else {
        api.openAgent({ flowId: module.flowId, triggerSource: "module", segmentId });
      }
    },

    // ---- N5 immersive ----
    openImmersive({ kind, flowId, segmentId }) {
      if (!state.levels.N5) { api.openAgent({ flowId, triggerSource: "module", segmentId }); return; }
      const anchor = (document.scrollingElement || document.documentElement).scrollTop;
      set({ immersive: { kind, flowId, segmentId }, readingAnchor: anchor, agent: null, activeLevelBadge: "N5" });
      emit("level.state.change", { level: "N5", from: "closed", to: "opening" });
      emit("agent.open", { triggerSource: "cta", segmentId });
    },
    closeImmersive() {
      const anchor = state.readingAnchor;
      set({ immersive: null });
      emit("level.state.change", { level: "N5", from: "conversation", to: "closing" });
      requestAnimationFrame(() => {
        (document.scrollingElement || document.documentElement).scrollTo({ top: anchor, behavior: state.reducedMotion ? "auto" : "smooth" });
      });
    },

    // sponsored instrumentation
    sponsoredImpression(offerId, kind) { emit("sponsored.impression", { offerId, kind }); },
    sponsoredClick(offerId, kind) { emit("sponsored.click", { offerId, kind }); },

    clearBadge() { set({ activeLevelBadge: null }); }
  };

  return api;
}

export const PresenceStore = createStore();

export function usePresence() {
  const s = useSyncExternalStore(PresenceStore.subscribe, PresenceStore.getState);
  return [s, PresenceStore];
}
