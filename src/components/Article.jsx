/* ============================================================
   Article.jsx — the host media page (PRD §4, §7.1 anchors, §11 non-destructive)
   Editorial serif content. The layer mounts ON it without altering copy.
   Renders: site chrome, hero, segments, inline N1 terms, N3 modules,
   one inline N4 sponsored card.
   ============================================================ */
import { useRef, Fragment } from "react";
import { DEMO } from "../data/index.js";
import { AgentMark } from "./AgentMark.jsx";
import { SponsoredFrame } from "./SponsoredFrame.jsx";
import { ContextualModule } from "./ContextualModule.jsx";

// ---- N1 augmented term (inline, distinct from links) ----
function AugmentedTerm({ termId, state, store }) {
  const ref = useRef(null);
  const term = DEMO.TERMS[termId];
  if (!term) return null;
  if (!state.levels.N1) return <span>{term.surface}</span>;
  const consulted = state.consultedTerms[termId];
  const open = state.lexical && state.lexical.termId === termId;
  const act = () => {
    const r = ref.current.getBoundingClientRect();
    store.openLexical(termId, { left: r.left, top: r.top, bottom: r.bottom, width: r.width });
  };
  return (
    <span
      ref={ref}
      role="button"
      tabIndex={0}
      className={"aug-term" + (consulted ? " consulted" : "") + (open ? " open" : "")}
      onClick={act}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } }}
      aria-label={"Explain: " + term.surface}
    >
      {term.surface}
      <span className="aug-spark" aria-hidden="true"><AgentMark size={9} color="currentColor" /></span>
    </span>
  );
}

// render a paragraph string with {{term}} tokens
function Para({ text, state, store }) {
  const parts = [];
  const re = /\{\{([^}]+)\}\}/g;
  let last = 0, m, key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<AugmentedTerm key={key++} termId={m[1]} state={state} store={store} />);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <p className="art-p">{parts}</p>;
}

function Segment({ seg, state, store }) {
  const showInlineAd =
    seg.id === "seg-nutrition" &&
    state.levels.N4 &&
    store.canShowMonetized(seg.id);
  const nutritionOffer = DEMO.OFFERS["off-nutrition"];

  return (
    <section className="art-seg" data-seg={seg.id} data-screen-label={"Section · " + seg.id}>
      {seg.title && <h2 className="art-h2">{seg.title}</h2>}
      {seg.paras.map((p, i) => (
        <Fragment key={i}>
          <Para text={p} state={state} store={store} />
          {/* inline N4 sponsored surface, woven into the read */}
          {showInlineAd && i === 0 && (
            <div className="art-inline-ad">
              <SponsoredFrame offer={nutritionOffer} variant="inline"
                onCta={() => store.openAgent({ flowId: "flow-summarize-plan", triggerSource: "cta", segmentId: seg.id })} />
            </div>
          )}
        </Fragment>
      ))}
      {seg.module && <ContextualModule module={seg.module} segmentId={seg.id} state={state} store={store} />}
    </section>
  );
}

function SiteHeader() {
  return (
    <header className="site-head">
      <div className="site-head-inner">
        <div className="site-brand">
          <span className="site-logo">L</span>
          <span className="site-name">Lemrock</span>
          <span className="site-sep">/</span>
          <span className="site-vertical">Outdoor</span>
        </div>
        <nav className="site-nav">
          <a href="#">Trail</a><a href="#">Gear</a><a href="#">Training</a><a href="#">Races</a>
        </nav>
        <div className="site-actions">
          <button className="site-search" aria-label="Search"><i className="ph ph-magnifying-glass" style={{ fontSize: 16 }}></i></button>
          <button className="site-sub">Subscribe</button>
        </div>
      </div>
    </header>
  );
}

export function Article({ state, store }) {
  const A = DEMO.ARTICLE;
  return (
    <div className="article-scroll">
      <SiteHeader />
      <main className="article" data-screen-label="Article">
        <div className="art-col">
          <div className="art-kicker">{A.kicker}</div>
          <h1 className="art-h1">{A.title}</h1>
          <p className="art-dek">{A.dek}</p>
          <div className="art-byline">
            <span className="art-avatar"><i className="ph-fill ph-mountains" style={{ fontSize: 15 }}></i></span>
            <span><strong>{A.author}</strong></span>
            <span className="art-dot">·</span>
            <span>{A.date}</span>
            <span className="art-dot">·</span>
            <span>{A.readTime}</span>
          </div>
        </div>
        <div className="art-hero" role="img" aria-label="Trail runner on a mountain ridge (placeholder)">
          <div className="art-hero-grad"></div>
          <i className="ph-fill ph-mountains art-hero-icon"></i>
          <span className="art-hero-cap">Photo · trail ridge at golden hour</span>
        </div>
        <div className="art-col art-body">
          {DEMO.SEGMENTS.map((seg) => <Segment key={seg.id} seg={seg} state={state} store={store} />)}
          <footer className="art-foot">
            <div className="art-foot-badge"><i className="ph-fill ph-seal-check" style={{ fontSize: 16, color: "var(--success)" }}></i> This page meets Better Ads Standards — no proscribed formats, labelled sponsorship, opt-out respected.</div>
            <div className="art-foot-meta">Lemrock Outdoor · Editorial. Conversational layer is a demonstrator.</div>
          </footer>
        </div>
      </main>
    </div>
  );
}
