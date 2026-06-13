/* ============================================================
   Chat.jsx — shared conversation engine (PRD §7.0.1, §7.5)
   Conversation-first surface used by the docked agent AND the N5
   immersive flows. Agent/reader bubbles, quick replies, typing
   indicator, product cards inline in the thread.
   ============================================================ */
import { useState, useRef, useEffect, Fragment } from "react";
import { DEMO } from "../data/index.js";
import { AgentMark } from "./AgentMark.jsx";
import { SponsoredFrame } from "./SponsoredFrame.jsx";

// ---- build a conversation node from a scripted FLOW (Annexe C) ----
export function flowToNode(id) {
  const f = DEMO.FLOWS[id];
  if (!f) return null;
  const agent = [{ text: f.message }];
  if (f.offerRef) agent.push({ card: f.offerRef });
  const options = (f.suggestedFollowups || []).map((fid) => {
    const ff = DEMO.FLOWS[fid];
    if (!ff) return null;
    return ff.immersive
      ? { label: ff.title, immersive: ff.immersive, flowRef: fid }
      : { label: ff.title, to: fid };
  }).filter(Boolean);
  return { agent, options: options.length ? options : null };
}
export const convResolver = (kind) => (id) => (DEMO.CONV[kind] || {})[id];

// ---- presentational ----
function MarkAvatar() {
  return <span className="chat-av"><AgentMark size={13} color="#fff" /></span>;
}

export function CompareCards({ ids }) {
  const offers = ids.map((id) => DEMO.OFFERS[id]).filter(Boolean);
  const rows = [["price", "Price"], ["battery", "Battery"], ["weight", "Weight"], ["gps", "GPS"]];
  return (
    <div className="chat-compare">
      {offers.map((o) => (
        <div key={o.offerId} className="cc-col">
          <div className="cc-media" style={{ background: `linear-gradient(135deg, ${o.swatch[0]}, ${o.swatch[1]})` }}>
            <i className="ph-fill ph-watch" style={{ fontSize: 24, color: "rgba(255,255,255,.92)" }}></i>
          </div>
          <div className="cc-name">{o.headline}</div>
          <div className="cc-label">{o.kind === "sponsored"
            ? <span className="cc-spon"><i className="ph-fill ph-megaphone-simple" style={{ fontSize: 10 }}></i> Sponsored</span>
            : <span className="cc-edit">Editorial</span>}</div>
          <dl className="cc-specs">
            {rows.map(([k, lbl]) => (<div key={k}><dt>{lbl}</dt><dd>{o.specs[k]}</dd></div>))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function Msg({ m, onCardCta }) {
  if (m.role === "user") {
    return <div className="chat-row user"><div className="chat-bubble user">{m.text}</div></div>;
  }
  if (m.card) {
    const offer = DEMO.OFFERS[m.card];
    return <div className="chat-card-msg"><SponsoredFrame offer={offer} variant="card" onCta={onCardCta} /></div>;
  }
  if (m.compare) {
    return <div className="chat-card-msg"><CompareCards ids={m.compare} /></div>;
  }
  return (
    <div className="chat-row agent">
      <MarkAvatar />
      <div className="chat-bubble agent">{m.text}</div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="chat-row agent">
      <MarkAvatar />
      <div className="chat-bubble agent typing"><span></span><span></span><span></span></div>
    </div>
  );
}

function QuickReplies({ options, onPick }) {
  return (
    <div className="qr-row">
      {options.map((o, i) => (
        <button key={i} className="qr-chip" onClick={() => onPick(o)}>
          {o.immersive && <i className="ph ph-arrows-out" style={{ fontSize: 13, marginRight: 5 }}></i>}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Composer({ onSend, disabled }) {
  const [v, setV] = useState("");
  const submit = () => { const t = v.trim(); if (!t) return; setV(""); onSend(t); };
  return (
    <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <input
        className="chat-input"
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Ask the companion anything…"
        aria-label="Message the companion"
      />
      <button type="submit" className="chat-send" disabled={!v.trim() || disabled} aria-label="Send">
        <i className="ph-fill ph-arrow-up" style={{ fontSize: 16 }}></i>
      </button>
    </form>
  );
}

// ---- free-text intent matching (scripted demo mode) ----
function matchIntent(text) {
  const t = text.toLowerCase();
  for (const id in DEMO.TERMS) {
    const s = DEMO.TERMS[id].surface.toLowerCase();
    if (s.length > 2 && t.includes(s)) return { flow: DEMO.TERMS[id].flowId };
  }
  if (/(shoe|chaussure|sneaker|footwear|find.*pair)/.test(t)) return { immersive: "finder", flowRef: "flow-recommend-shoes" };
  if (/(watch|montre|gps|compare|comparer|tracker)/.test(t)) return { immersive: "comparator", flowRef: "flow-montre-compare" };
  if (/(plan|week|training|progress|schedule|build up)/.test(t)) return { flow: "flow-summarize-plan" };
  if (/(eat|nutrition|gel|fuel|food|snack|hydrat|water|drink|flask)/.test(t)) return { flow: "flow-softflasks" };
  if (/(d\+|deniv|elevation|climb|vert|hill|uphill)/.test(t)) return { flow: "flow-dplus" };
  if (/(pole|baton|stick)/.test(t)) return { flow: "flow-poles" };
  if (/(vo2|fitness|aerobic|cardio fit)/.test(t)) return { flow: "flow-vo2max" };
  return null;
}

const FALLBACK_OPTIONS = [
  { label: "Find my shoe", immersive: "finder", flowRef: "flow-recommend-shoes" },
  { label: "Compare GPS watches", immersive: "comparator", flowRef: "flow-montre-compare" },
  { label: "What's D+?", flow: "flow-dplus" }
];

// ---- the engine ----
export function Conversation({ resolve, startId, store }) {
  const reduced = store.getState().reducedMotion;
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [options, setOptions] = useState(null);
  const answers = useRef({});
  const timers = useRef([]);
  const alive = useRef(true);
  const scroller = useRef(null);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const push = (m) => setMsgs((p) => [...p, m]);
  const normalize = (m) => typeof m === "string" ? { role: "agent", text: m }
    : m.card ? { role: "agent", card: m.card }
    : m.compare ? { role: "agent", compare: m.compare }
    : { role: "agent", text: m.text };

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [msgs, typing, options]);

  const playSeq = (node) => {
    setOptions(null);
    if (!node) return;
    const seq = node.agent || [];
    let delay = 0;
    seq.forEach((m) => {
      const norm = normalize(m);
      const isText = norm.text != null;
      if (!reduced) {
        if (isText) { const t0 = delay; timers.current.push(setTimeout(() => { if (alive.current) setTyping(true); }, t0)); delay += Math.min(950, 320 + norm.text.length * 4); }
        else delay += 220;
      }
      timers.current.push(setTimeout(() => { if (!alive.current) return; setTyping(false); push(norm); }, delay));
      delay += reduced ? 0 : 150;
    });
    timers.current.push(setTimeout(() => { if (!alive.current) return; setTyping(false); setOptions(node.options || null); }, delay));
  };
  const playNode = (id) => { playSeq(resolve(id)); };

  useEffect(() => {
    alive.current = true;
    setMsgs([]); setOptions(null); setTyping(false);
    playNode(startId);
    return () => { alive.current = false; clearTimers(); };
  }, [startId]);

  const advance = (opt) => {
    setOptions(null);
    if (opt.label) push({ role: "user", text: opt.label });
    if (opt.set) answers.current = { ...answers.current, ...opt.set };
    if (opt.immersive) { store.openImmersive({ kind: opt.immersive, flowId: opt.flowRef, segmentId: null }); return; }
    if (opt.flow) { timers.current.push(setTimeout(() => playSeq(flowToNode(opt.flow)), reduced ? 0 : 200)); return; }
    if (opt.reset) { answers.current = {}; clearTimers(); setMsgs([]); timers.current.push(setTimeout(() => playNode(opt.to), reduced ? 0 : 220)); return; }
    if (opt.ack && !reduced) {
      setTyping(true);
      timers.current.push(setTimeout(() => {
        if (!alive.current) return;
        setTyping(false); push({ role: "agent", text: opt.ack });
        timers.current.push(setTimeout(() => playNode(opt.to), 320));
      }, 520));
    } else {
      if (opt.ack) push({ role: "agent", text: opt.ack });
      playNode(opt.to);
    }
  };

  // ---- free-text input ----
  const onSend = (text) => {
    setOptions(null);
    push({ role: "user", text });
    store.emit("agent.open", { triggerSource: "cta", segmentId: null });
    const m = matchIntent(text);
    const replyDelay = reduced ? 0 : 560;
    if (!reduced) setTyping(true);
    timers.current.push(setTimeout(() => {
      if (!alive.current) return;
      setTyping(false);
      if (!m) {
        push({ role: "agent", text: "I'm in scripted demo mode, so I'm best on the trail kit, climbs (D+), nutrition, the GPS watches, or finding your shoe. Want one of these?" });
        timers.current.push(setTimeout(() => { if (alive.current) setOptions(FALLBACK_OPTIONS); }, reduced ? 0 : 250));
        return;
      }
      if (m.immersive) {
        push({ role: "agent", text: m.immersive === "finder" ? "Let's find your shoe together — one moment." : "Let's compare those watches — one moment." });
        timers.current.push(setTimeout(() => { if (alive.current) store.openImmersive({ kind: m.immersive, flowId: m.flowRef, segmentId: null }); }, reduced ? 0 : 620));
        return;
      }
      if (m.flow) playSeq(flowToNode(m.flow));
    }, replyDelay));
  };

  const onCardCta = (offer) => {
    if (offer.kind === "sponsored") store.sponsoredClick(offer.offerId, offer.kind);
    const cta = offer.cta || {};
    if (cta.action === "openAgent" && cta.target) {
      const f = DEMO.FLOWS[cta.target];
      if (f && f.immersive) { store.openImmersive({ kind: f.immersive, flowId: cta.target, segmentId: null }); return; }
      advance({ label: cta.text, to: cta.target });
    }
  };

  return (
    <Fragment>
      <div className="chat-thread thin-scroll" ref={scroller}>
        {msgs.map((m, i) => <Msg key={i} m={m} onCardCta={onCardCta} />)}
        {typing && <TypingBubble />}
        {options && <QuickReplies options={options} onPick={advance} />}
        <div style={{ height: 2 }}></div>
      </div>
      <Composer onSend={onSend} disabled={typing} />
    </Fragment>
  );
}
