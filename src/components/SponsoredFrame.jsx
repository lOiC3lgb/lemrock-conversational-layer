/* ============================================================
   SponsoredFrame.jsx — l'écrin de monétisation unique (PRD §7.0.2, §7.4)
   Un seul gabarit rend toutes les surfaces payantes/éditoriales via des slots.
   - une offre sponsorisée porte TOUJOURS un label visible + la marque
   - une offre éditoriale est distincte, jamais labellisée sponsorisée
   - viewability : l'impression ne part qu'après >=50% visible >=1s
   ============================================================ */
import { useRef, useEffect } from "react";
import { PresenceStore } from "../store/store.js";

const CATEGORY_ICON = {
  "trail-shoes": "ph-sneaker-move",
  "gps-watch": "ph-watch",
  "hydration": "ph-drop",
  "poles": "ph-mountains",
  "nutrition": "ph-lightning"
};

// média : photo réelle si disponible, sinon un aplat propre (jamais une fausse photo bâclée)
export function OfferMedia({ offer, h }) {
  const [a, b] = offer.swatch || ["#3a3a36", "#8a8a82"];
  const icon = CATEGORY_ICON[offer.category] || "ph-package";
  const base = {
    height: h, flex: h ? "none" : 1, minWidth: h,
    borderRadius: "12px", position: "relative", overflow: "hidden",
    background: `linear-gradient(135deg, ${a}, ${b})`,
    display: "flex", alignItems: "center", justifyContent: "center"
  };
  if (offer.photo) {
    return (
      <div style={base}>
        <img
          src={offer.photo}
          alt={offer.headline}
          loading="lazy"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>
    );
  }
  return (
    <div style={base}>
      <i className={"ph-fill " + icon} style={{ fontSize: h ? Math.round(h * 0.42) : 40, color: "rgba(255,255,255,0.92)" }} aria-hidden="true"></i>
      <span style={{
        position: "absolute", left: 8, bottom: 7, fontSize: 9.5, letterSpacing: ".08em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontWeight: 600
      }}>photo</span>
    </div>
  );
}

export function SponsoredLabel({ offer }) {
  if (offer.kind !== "sponsored") return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "var(--font-agent)", fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em",
      textTransform: "uppercase", color: "var(--sponsored-fg)",
      background: "var(--sponsored-bg)", border: "1px solid var(--sponsored-line)",
      padding: "2px 8px", borderRadius: "999px", whiteSpace: "nowrap"
    }}>
      <i className="ph-fill ph-megaphone-simple" style={{ fontSize: 11 }} aria-hidden="true"></i>
      Sponsorisé · {offer.brand}
    </span>
  );
}

export function EditorialTag() {
  return (
    <span style={{
      fontFamily: "var(--font-agent)", fontSize: 10.5, fontWeight: 600, letterSpacing: ".06em",
      textTransform: "uppercase", color: "var(--ink-3)", display: "inline-flex", alignItems: "center", gap: 5
    }}>
      <i className="ph ph-pencil-simple-line" style={{ fontSize: 12 }} aria-hidden="true"></i>
      Choix éditorial
    </span>
  );
}

// viewability — PRD §10 : >=50% visible >=1s avant de compter une impression
function useViewability(ref, offer) {
  useEffect(() => {
    if (!ref.current) return;
    let timer = null, counted = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.intersectionRatio >= 0.5 && !counted) {
          timer = setTimeout(() => { counted = true; PresenceStore.sponsoredImpression(offer.offerId, offer.kind); }, 1000);
        } else if (en.intersectionRatio < 0.5 && timer) {
          clearTimeout(timer); timer = null;
        }
      });
    }, { threshold: [0, 0.5, 1] });
    io.observe(ref.current);
    return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, []);
}

// ---- écrin principal ----
// variant : "card" (défaut), "inline" (pleine largeur dans l'article), "mini" (ligne compacte)
export function SponsoredFrame({ offer, variant = "card", onCta }) {
  const ref = useRef(null);
  const sponsored = offer.kind === "sponsored";
  useViewability(ref, offer);

  // fallback — ne jamais rendre une carte cassée (PRD §7.4)
  if (!offer.headline) return null;

  const frameBase = {
    fontFamily: "var(--font-agent)",
    borderRadius: "16px",
    border: sponsored ? "1px solid var(--sponsored-line)" : "1px solid var(--border)",
    background: sponsored ? "linear-gradient(180deg, #fffdf8, #ffffff)" : "var(--surface)",
    boxShadow: "var(--shadow-1)",
    position: "relative", overflow: "hidden"
  };

  const handleCta = () => {
    if (sponsored) PresenceStore.sponsoredClick(offer.offerId, offer.kind);
    onCta && onCta(offer);
  };

  if (variant === "mini") {
    return (
      <div ref={ref} style={{ ...frameBase, display: "flex", gap: 12, padding: 10, alignItems: "center", borderRadius: "13px" }}>
        <OfferMedia offer={offer} h={46} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{offer.headline}</span>
          </div>
          {sponsored ? <SponsoredLabel offer={offer} /> : <EditorialTag />}
        </div>
        <button onClick={handleCta} style={miniCta}>{offer.cta.text}</button>
      </div>
    );
  }

  // carte par défaut / inline
  const isInline = variant === "inline";
  return (
    <div ref={ref} style={{ ...frameBase, padding: isInline ? 18 : 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        {sponsored ? <SponsoredLabel offer={offer} /> : <EditorialTag />}
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-1)" }}>{offer.price}</span>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <OfferMedia offer={offer} h={isInline ? 96 : 80} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 700, fontSize: isInline ? 16 : 15, color: "var(--ink-1)", lineHeight: 1.2 }}>{offer.headline}</div>
          {offer.subline && (
            <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45, marginTop: 4 }}>{offer.subline}</div>
          )}
          <div style={{ flex: 1 }}></div>
          <button onClick={handleCta} style={{ ...primaryCta, marginTop: 12, alignSelf: "flex-start" }}>
            {offer.cta.text}
            <i className="ph ph-arrow-right" style={{ fontSize: 14 }} aria-hidden="true"></i>
          </button>
        </div>
      </div>
      {sponsored && (
        <div style={{ marginTop: 10, paddingTop: 9, borderTop: "1px dashed var(--sponsored-line)", fontSize: 11, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6 }}>
          <i className="ph ph-info" style={{ fontSize: 12 }} aria-hidden="true"></i>
          Placement payant. Affiché parce qu'il correspond à votre lecture.
        </div>
      )}
    </div>
  );
}

const primaryCta = {
  display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
  fontFamily: "var(--font-agent)", fontSize: 13, fontWeight: 600,
  color: "var(--ink-inverse)", background: "var(--accent)",
  border: "none", borderRadius: "999px", padding: "8px 14px",
  transition: "background var(--t-fast) var(--ease)"
};
const miniCta = {
  cursor: "pointer", fontFamily: "var(--font-agent)", fontSize: 12.5, fontWeight: 600,
  color: "var(--accent-soft)", background: "transparent", border: "1px solid var(--border-strong)",
  borderRadius: "999px", padding: "7px 12px", whiteSpace: "nowrap"
};
