/* ============================================================
   Chat.jsx — moteur de conversation partagé (PRD §7.0.1, §7.5)
   Surface conversation-first utilisée par l'agent ancré ET par les flows
   immersifs N5. Bulles agent/lecteur, réponses rapides, indicateur de
   frappe, cartes produit tissées dans le fil.
   ============================================================ */
import { useState, useRef, useEffect, Fragment } from "react";
import { DEMO } from "../data/index.js";
import { AgentMark } from "./AgentMark.jsx";
import { SponsoredFrame } from "./SponsoredFrame.jsx";

// ---- construit un nœud de conversation depuis un FLOW scripté (Annexe C) ----
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

// ---- présentation ----
function MarkAvatar() {
  return <span className="chat-av"><AgentMark size={13} color="#fff" /></span>;
}

export function CompareCards({ ids }) {
  const offers = ids.map((id) => DEMO.OFFERS[id]).filter(Boolean);
  const rows = [["price", "Prix"], ["battery", "Autonomie"], ["weight", "Poids"], ["gps", "GPS"]];
  return (
    <div className="chat-compare">
      {offers.map((o) => (
        <div key={o.offerId} className="cc-col">
          <div className="cc-media" style={{ background: `linear-gradient(135deg, ${o.swatch[0]}, ${o.swatch[1]})`, overflow: "hidden" }}>
            {o.photo
              ? <img src={o.photo} alt={o.headline} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
              : <i className="ph-fill ph-watch" style={{ fontSize: 24, color: "rgba(255,255,255,.92)" }}></i>}
          </div>
          <div className="cc-name">{o.headline}</div>
          <div className="cc-label">{o.kind === "sponsored"
            ? <span className="cc-spon"><i className="ph-fill ph-megaphone-simple" style={{ fontSize: 10 }}></i> Sponsorisé</span>
            : <span className="cc-edit">Éditorial</span>}</div>
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

// standard AI prompt block — textarea on top, tools row below (attach / voice / send)
function Composer({ onSend, disabled }) {
  const [v, setV] = useState("");
  const taRef = useRef(null);
  const grow = (el) => { el.style.height = "auto"; el.style.height = Math.min(132, el.scrollHeight) + "px"; };
  const submit = () => {
    const t = v.trim(); if (!t) return;
    setV(""); if (taRef.current) taRef.current.style.height = "auto";
    onSend(t);
  };
  return (
    <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <textarea
        ref={taRef}
        className="chat-input"
        rows={1}
        value={v}
        onChange={(e) => { setV(e.target.value); grow(e.target); }}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
        placeholder="Écrire au compagnon…"
        aria-label="Message au compagnon"
      />
      <div className="chat-tools">
        <button type="button" className="cc-tool" aria-label="Ajouter une pièce jointe" title="Ajouter une pièce jointe">
          <i className="ph ph-plus" style={{ fontSize: 17 }}></i>
        </button>
        <div className="chat-tools-right">
          <button type="button" className="cc-tool" aria-label="Dictée vocale" title="Dictée vocale">
            <i className="ph ph-microphone" style={{ fontSize: 16 }}></i>
          </button>
          <button type="submit" className="chat-send" disabled={!v.trim() || disabled} aria-label="Envoyer">
            <i className="ph-fill ph-arrow-up" style={{ fontSize: 16 }}></i>
          </button>
        </div>
      </div>
    </form>
  );
}

// ---- correspondance d'intention en texte libre (mode démo scripté) ----
function matchIntent(text) {
  const t = text.toLowerCase();
  for (const id in DEMO.TERMS) {
    const s = DEMO.TERMS[id].surface.toLowerCase();
    if (s.length > 3 && t.includes(s)) return { flow: DEMO.TERMS[id].flowId };
  }
  if (/(chaussure|shoe|basket|paire|chaussant)/.test(t)) return { immersive: "finder", flowRef: "flow-recommend-shoes" };
  if (/(montre|watch|gps|comparer|compare|tracker)/.test(t)) return { immersive: "comparator", flowRef: "flow-montre-compare" };
  if (/(plan|semaine|entra[îi]n|programme|progress|prépar|prepar)/.test(t)) return { flow: "flow-summarize-plan" };
  if (/(mang|nutrition|gel|ravito|aliment|barre|hydrat|boire|\beau\b|flasque)/.test(t)) return { flow: "flow-nutrition" };
  if (/(d\+|déniv|deniv|dénivelé|denivele|mont[ée]e|montee|grimp|c[ôo]te|vertical)/.test(t)) return { flow: "flow-dplus" };
  if (/(b[âa]ton|pole|stick)/.test(t)) return { flow: "flow-poles" };
  if (/(vo2|aérobie|aerobie)/.test(t)) return { flow: "flow-vo2max" };
  return null;
}

const FALLBACK_OPTIONS = [
  { label: "Trouver ma chaussure", immersive: "finder", flowRef: "flow-recommend-shoes" },
  { label: "Comparer les montres GPS", immersive: "comparator", flowRef: "flow-montre-compare" },
  { label: "C'est quoi le D+ ?", flow: "flow-dplus" }
];

// ---- le moteur ----
export function Conversation({ resolve, startId, initialQuery, store }) {
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
    if (initialQuery) onSend(initialQuery);   // opened via the bubble's free-text field
    else playNode(startId);
    return () => { alive.current = false; clearTimers(); };
  }, [startId, initialQuery]);

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

  // ---- entrée texte libre ----
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
        push({ role: "agent", text: "Je suis en mode démo scripté, donc je suis au mieux sur le matériel, les montées (D+), la nutrition, les montres GPS, ou pour trouver votre chaussure. Vous voulez l'un de ces sujets ?" });
        timers.current.push(setTimeout(() => { if (alive.current) setOptions(FALLBACK_OPTIONS); }, reduced ? 0 : 250));
        return;
      }
      if (m.immersive) {
        push({ role: "agent", text: m.immersive === "finder" ? "Trouvons votre chaussure ensemble — un instant." : "Comparons ces montres — un instant." });
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
