/* ============================================================
   data.js — the demonstrator's content & data model (PRD §8)
   Annexe A (article), B (offer catalogue), C (scripted flows).
   English editorial content. No style values here.
   Augmented terms are marked inline as {{term-id}} and resolved at render.
   ============================================================ */

// ---------------------------------------------------------
// AUGMENTED TERMS (N1) — keyed by id
// ---------------------------------------------------------
export const TERMS = {
  "term-drop": {
    id: "term-drop", surface: "drop", segmentId: "seg-materiel",
    flowId: "flow-drop", offerRef: null
  },
  "term-softflasks": {
    id: "term-softflasks", surface: "soft flasks", segmentId: "seg-materiel",
    flowId: "flow-softflasks", offerRef: "off-hydration"
  },
  "term-poles": {
    id: "term-poles", surface: "poles", segmentId: "seg-materiel",
    flowId: "flow-poles", offerRef: "off-poles"
  },
  "term-dplus": {
    id: "term-dplus", surface: "D+", segmentId: "seg-denivele",
    flowId: "flow-dplus", offerRef: null
  },
  "term-vo2max": {
    id: "term-vo2max", surface: "VO2max", segmentId: "seg-denivele",
    flowId: "flow-vo2max", offerRef: null
  },
  "term-gps": {
    id: "term-gps", surface: "GPS accuracy", segmentId: "seg-montre",
    flowId: "flow-gps", offerRef: null
  },
  "term-cardio": {
    id: "term-cardio", surface: "wrist heart-rate", segmentId: "seg-montre",
    flowId: "flow-cardio", offerRef: null
  }
};

// ---------------------------------------------------------
// OFFER CATALOGUE (N4 / upsell) — Annexe B
// ---------------------------------------------------------
export const OFFERS = {
  "off-shoeA": {
    offerId: "off-shoeA", kind: "sponsored", brand: "Saltus",
    label: "Sponsored", category: "trail-shoes",
    headline: "Saltus Ridge GTX", subline: "Grippy lugs for soft, technical singletrack — built for first muddy seasons.",
    price: "$148", swatch: ["#3b4a3a", "#c5743a"],
    cta: { text: "See the fit", action: "openAgent", target: "flow-chaussure-sponsored" },
    targetSegmentIds: ["seg-materiel"]
  },
  "off-watchA": {
    offerId: "off-watchA", kind: "sponsored", brand: "Pace Labs",
    label: "Sponsored", category: "gps-watch",
    headline: "Pace Labs Apex 2", subline: "Dual-band GPS, 38 h tracking.",
    price: "$329", swatch: ["#1d2733", "#d9b25b"],
    specs: { battery: "38 h", weight: "52 g", gps: "Dual-band", hr: "Optical + chest", price: "$329" },
    cta: { text: "Compare offers", action: "openAgent", target: "flow-montre-compare" },
    targetSegmentIds: ["seg-montre"]
  },
  "off-watchB": {
    offerId: "off-watchB", kind: "editorial", brand: "Northwind",
    label: null, category: "gps-watch",
    headline: "Northwind Trail 50", subline: "All-rounder, great value.",
    price: "$219", swatch: ["#26303a", "#5a8f7b"],
    specs: { battery: "26 h", weight: "48 g", gps: "Single-band", hr: "Optical", price: "$219" },
    cta: { text: "Details", action: "openAgent", target: null },
    targetSegmentIds: ["seg-montre"]
  },
  "off-watchC": {
    offerId: "off-watchC", kind: "editorial", brand: "Cardo",
    label: null, category: "gps-watch",
    headline: "Cardo Run S", subline: "Lightest, best for short outings.",
    price: "$179", swatch: ["#2b2733", "#b0607a"],
    specs: { battery: "18 h", weight: "39 g", gps: "Single-band", hr: "Optical", price: "$179" },
    cta: { text: "Details", action: "openAgent", target: null },
    targetSegmentIds: ["seg-montre"]
  },
  "off-hydration": {
    offerId: "off-hydration", kind: "editorial", brand: "—",
    label: null, category: "hydration",
    headline: "Hydration vest, 5 L", subline: "Two 500 ml soft flasks up front, no bounce.",
    price: "$95", swatch: ["#2a3640", "#7a8a93"],
    cta: { text: "How to choose", action: "openAgent", target: null },
    targetSegmentIds: ["seg-materiel"]
  },
  "off-poles": {
    offerId: "off-poles", kind: "editorial", brand: "—",
    label: null, category: "poles",
    headline: "Folding carbon poles", subline: "Z-fold, 230 g the pair — for steep climbs.",
    price: "$110", swatch: ["#2e2a25", "#a98f6b"],
    cta: { text: "How to choose", action: "openAgent", target: null },
    targetSegmentIds: ["seg-materiel"]
  },
  "off-nutrition": {
    offerId: "off-nutrition", kind: "sponsored", brand: "Vertic Fuel",
    label: "Sponsored", category: "nutrition",
    headline: "Vertic Fuel gels", subline: "Gentle on the stomach, 22 g carbs each.",
    price: "$2.40", swatch: ["#33291f", "#d98b3a"],
    cta: { text: "Try a sample pack", action: "openAgent", target: null },
    targetSegmentIds: ["seg-nutrition"]
  }
};

// ---------------------------------------------------------
// SCRIPTED AGENT FLOWS — Annexe C
// ---------------------------------------------------------
export const FLOWS = {
  "flow-drop": {
    flowId: "flow-drop", title: "drop",
    message: "Drop is the height difference between the heel and the forefoot of a shoe, in millimetres. A high drop (8–10 mm) cushions the heel strike; a low drop (0–4 mm) keeps you closer to the ground and loads the calves more. For a first trail season, 6–8 mm is a forgiving middle ground.",
    suggestedFollowups: ["flow-recommend-shoes"], offerRef: null
  },
  "flow-softflasks": {
    flowId: "flow-softflasks", title: "soft flasks",
    message: "Soft flasks are collapsible bottles that ride in the front pockets of a hydration vest. They shrink as you drink, so nothing sloshes against your chest. Two 500 ml flasks up front is the most common beginner setup.",
    suggestedFollowups: [], offerRef: "off-hydration"
  },
  "flow-poles": {
    flowId: "flow-poles", title: "poles",
    message: "Poles take load off your legs on steep climbs and steady you on loose descents. Folding (Z-fold) carbon pairs weigh ~230 g and stow in a vest. Most beginners only reach for them once climbs get long.",
    suggestedFollowups: [], offerRef: "off-poles"
  },
  "flow-dplus": {
    flowId: "flow-dplus", title: "D+",
    message: "D+ is the total vertical gain of a route — every metre you climb, added up. 800 m of D+ over 20 km is already serious for a first season. Distance alone tells you very little on trail; pair it with D+ to gauge real effort.",
    suggestedFollowups: ["flow-summarize-plan"], offerRef: null
  },
  "flow-vo2max": {
    flowId: "flow-vo2max", title: "VO2max",
    message: "VO2max is the most oxygen your body can use per minute — a ceiling on sustained aerobic effort. You don't need to chase the number as a beginner: consistent easy mileage raises it on its own over the first months.",
    suggestedFollowups: [], offerRef: null
  },
  "flow-gps": {
    flowId: "flow-gps", title: "GPS accuracy",
    message: "Under tree cover and in valleys, single-band GPS can drift and over-read distance. Dual-band (multi-frequency) tracks the same trace far more tightly — the main reason to spend up on a watch if you run technical terrain.",
    suggestedFollowups: ["flow-montre-compare"], offerRef: null
  },
  "flow-cardio": {
    flowId: "flow-cardio", title: "wrist heart-rate",
    message: "Wrist optical heart-rate is convenient but lags on sharp climbs and in the cold. For steady zone-2 base training it's fine; if you train by precise zones, a chest strap is still more honest.",
    suggestedFollowups: [], offerRef: null
  },
  "flow-summarize-plan": {
    flowId: "flow-summarize-plan", title: "8-week plan, in 20 seconds",
    message: "Weeks 1–2: three easy runs, walk the climbs. Weeks 3–5: add one hilly run and a little D+ each week. Weeks 6–7: a longer weekend outing, keep one full rest day. Week 8: ease off, then run your first trail relaxed. Rule of thumb: only one hard thing per week.",
    suggestedFollowups: ["flow-recommend-shoes"], offerRef: null
  },
  "flow-montre-compare": {
    flowId: "flow-montre-compare", title: "Comparing 3 GPS watches",
    message: "Here's how the three stack up for a beginner. Pace Labs is sponsored — it's flagged below. Northwind is the value all-rounder; Cardo is lightest for short outings.",
    suggestedFollowups: [], offerRef: null, immersive: "comparator"
  },
  "flow-recommend-shoes": {
    flowId: "flow-recommend-shoes", title: "Find trail shoes that fit you",
    message: "Three quick questions and I'll narrow it down — terrain, how often you'll run, and budget.",
    suggestedFollowups: [], offerRef: null, immersive: "finder"
  },
  "flow-chaussure-sponsored": {
    flowId: "flow-chaussure-sponsored", title: "Saltus Ridge GTX",
    message: "Starting on soft, technical singletrack? The Ridge GTX runs grippy with a 6 mm drop — forgiving for a first season. This is a sponsored recommendation from Saltus.",
    suggestedFollowups: ["flow-recommend-shoes"], offerRef: "off-shoeA"
  }
};

// ---------------------------------------------------------
// ARTICLE + SEGMENTS — Annexe A
// ---------------------------------------------------------
export const SEGMENTS = [
  {
    id: "seg-intro", order: 1, title: null, nativeAdDensity: 0.05,
    paras: [
      "Trail running isn't road running with a few rocks scattered on it. The ground moves under you, the gradient never settles, and the effort comes in waves rather than a steady hum. That's the appeal — and the reason your first outings can feel humbling if you treat them like a flat 10K.",
      "The good news: starting well is mostly about expectations, not fitness. Get a handful of things right and the trail stops fighting you. This guide walks through the gear that actually matters, how to read climbs, what to eat, the watch question, and a gentle eight-week on-ramp."
    ],
    module: null
  },
  {
    id: "seg-materiel", order: 2, title: "The gear that actually changes things",
    nativeAdDensity: 0.12,
    paras: [
      "You need far less than the shops suggest, but three things genuinely change the experience. Shoes come first. Trail shoes trade road cushioning for grip — deeper lugs that bite into mud and a rubber that holds on wet rock. The other number to know is {{term-drop}}, which decides how the shoe loads your legs over long descents.",
      "Hydration is the second. A light vest with two {{term-softflasks}} up front keeps water close and your hands free, which matters more than capacity on anything under two hours.",
      "Third, and optional at first: {{term-poles}}. Most beginners ignore them until their first genuinely steep climb, then never go back."
    ],
    module: {
      type: "recommend", label: "Find trail shoes that fit you",
      flowId: "flow-recommend-shoes", offerIds: ["off-shoeA"]
    }
  },
  {
    id: "seg-denivele", order: 3, title: "Reading the climb",
    nativeAdDensity: 0.08,
    paras: [
      "On trail, distance lies. Twelve kilometres can be a jog or a death march depending on one number: {{term-dplus}}. Learn to read it and you'll pace climbs you've never seen before with surprising calm.",
      "The technique that saves beginners isn't running harder — it's walking. Power-hiking the steep bits keeps your heart rate off the ceiling and your legs intact for the top. You don't need a high {{term-vo2max}} to enjoy this; you need to spend less of it on the wrong sections."
    ],
    module: null
  },
  {
    id: "seg-nutrition", order: 4, title: "Eating on the move",
    nativeAdDensity: 0.10,
    paras: [
      "Under an hour, water is plenty. Past that, your body wants a small, steady drip of carbohydrate — think 20 to 30 grams every half hour rather than one big hit when you're already empty.",
      "Gels are the compact option; chews and a banana in the pack work just as well. The only real rule is to practise it on training runs, never to debut a new flavour on race morning."
    ],
    module: null
  },
  {
    id: "seg-montre", order: 5, title: "Your first GPS watch",
    nativeAdDensity: 0.16,
    paras: [
      "A watch is the one piece of kit where spending more genuinely buys accuracy. The two things that separate a $179 watch from a $329 one are {{term-gps}} and battery life — everything else is mostly software.",
      "Don't over-buy. {{term-cardio}} is good enough for easy base training, and 18 hours of battery covers far more than a beginner will ever run in one go. Match the watch to the running you'll actually do, not the running you imagine."
    ],
    module: {
      type: "compare", label: "Compare these 3 GPS watches",
      flowId: "flow-montre-compare", offerIds: ["off-watchA", "off-watchB", "off-watchC"]
    }
  },
  {
    id: "seg-plan", order: 6, title: "The eight-week on-ramp",
    nativeAdDensity: 0.06,
    paras: [
      "You can be trail-ready in two months without wrecking yourself. The shape is simple: build easy volume first, add a little climbing each week, and protect one full rest day like it's training — because it is.",
      "The single most common beginner mistake is doing two hard things in the same week. One quality session — a hilly run or a longer outing — is plenty. Everything else stays conversational."
    ],
    module: null
  },
  {
    id: "seg-conclusion", order: 7, title: "Your first steps",
    nativeAdDensity: 0.04,
    paras: [
      "Pick a route with modest D+, walk the climbs without guilt, carry a little water and a snack, and let the watch sit quietly on your wrist. The trail rewards patience far more than ambition.",
      "If you only sort one thing before you start, make it the shoes. Get those right and the first season is a pleasure rather than a fight."
    ],
    module: {
      type: "recommend", label: "Find your shoe",
      flowId: "flow-recommend-shoes", offerIds: ["off-shoeA"], hero: true
    }
  }
];

export const ARTICLE = {
  articleId: "trail-debutant-001",
  vertical: "sport / outdoor",
  kicker: "Trail running · Getting started",
  title: "How to start trail running without blowing up on your first climbs",
  dek: "Less kit than you think, one number that matters more than distance, and an eight-week on-ramp that won't break you.",
  author: "Lemrock Outdoors",
  date: "June 2026",
  readTime: "7 min read",
  segmentIds: SEGMENTS.map(s => s.id)
};

// ---------------------------------------------------------
// CONFIG / GOVERNANCE (PRD §8, §9) — hooks, no style values
// ---------------------------------------------------------
export const CONFIG = {
  levels: { enabled: { N1: true, N2: true, N3: true, N4: true, N5: true } },
  agentMode: "scripted",
  governance: {
    maxSolicitationsPerSession: 4,
    cooldownBetweenSolicitations: 6000,   // ms
    scrollAwakeThreshold: 0.18,           // fraction of article scrolled
    dwellAwakeMs: 1400,
    moduleViewportThreshold: 0.6,
    nativeDensityCap: 0.30
  }
};

// teaser scripts the ambient bubble can surface, tied to a segment
export const TEASERS = [
  { id: "tz-watch", segmentId: "seg-montre", line: "Comparing 3 GPS watches?", flowId: "flow-montre-compare", sponsored: false },
  { id: "tz-plan",  segmentId: "seg-plan",  line: "Want the 8-week plan in 20 seconds?", flowId: "flow-summarize-plan", sponsored: false },
  { id: "tz-shoe",  segmentId: "seg-materiel", line: "Not sure which trail shoe? Saltus can help.", flowId: "flow-chaussure-sponsored", sponsored: true }
];
