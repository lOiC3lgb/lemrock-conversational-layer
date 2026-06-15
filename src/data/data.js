/* ============================================================
   data.js — contenu & modèle de données du démonstrateur (PRD §8)
   Annexe A (article), B (catalogue d'offres), C (flows scriptés).
   Contenu éditorial en français. Aucune valeur de style ici.
   Les termes augmentés sont notés {{term-id}} et résolus au rendu.
   ============================================================ */

const IMG = (id, w = 640) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

// ---------------------------------------------------------
// TERMES AUGMENTÉS (N1) — indexés par id
// ---------------------------------------------------------
export const TERMS = {
  "term-drop": {
    id: "term-drop", surface: "drop", segmentId: "seg-materiel",
    flowId: "flow-drop", offerRef: null
  },
  "term-softflasks": {
    id: "term-softflasks", surface: "flasques souples", segmentId: "seg-materiel",
    flowId: "flow-softflasks", offerRef: "off-hydration"
  },
  "term-poles": {
    id: "term-poles", surface: "bâtons", segmentId: "seg-materiel",
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
    id: "term-gps", surface: "précision GPS", segmentId: "seg-montre",
    flowId: "flow-gps", offerRef: null
  },
  "term-cardio": {
    id: "term-cardio", surface: "cardio au poignet", segmentId: "seg-montre",
    flowId: "flow-cardio", offerRef: null
  }
};

// ---------------------------------------------------------
// CATALOGUE D'OFFRES (N4 / upsell) — Annexe B
// ---------------------------------------------------------
export const OFFERS = {
  "off-shoeA": {
    offerId: "off-shoeA", kind: "sponsored", brand: "Saltus",
    label: "Sponsorisé", category: "trail-shoes",
    headline: "Saltus Ridge GTX", subline: "Crampons accrocheurs pour sentier meuble et technique — pensée pour les premières saisons boueuses.",
    price: "148 €", swatch: ["#3b4a3a", "#c5743a"], photo: IMG("photo-1542291026-7eec264c27ff"),
    cta: { text: "Voir le modèle", action: "openAgent", target: "flow-chaussure-sponsored" },
    targetSegmentIds: ["seg-materiel"]
  },
  "off-watchA": {
    offerId: "off-watchA", kind: "sponsored", brand: "Pace Labs",
    label: "Sponsorisé", category: "gps-watch",
    headline: "Pace Labs Apex 2", subline: "GPS double-bande, 38 h d'autonomie.",
    price: "329 €", swatch: ["#1d2733", "#d9b25b"], photo: IMG("photo-1579586337278-3befd40fd17a"),
    specs: { battery: "38 h", weight: "52 g", gps: "Double-bande", hr: "Optique + ceinture", price: "329 €" },
    cta: { text: "Comparer les offres", action: "openAgent", target: "flow-montre-compare" },
    targetSegmentIds: ["seg-montre"]
  },
  "off-watchB": {
    offerId: "off-watchB", kind: "editorial", brand: "Northwind",
    label: null, category: "gps-watch",
    headline: "Northwind Trail 50", subline: "Polyvalente, excellent rapport qualité-prix.",
    price: "219 €", swatch: ["#26303a", "#5a8f7b"], photo: IMG("photo-1508685096489-7aacd43bd3b1"),
    specs: { battery: "26 h", weight: "48 g", gps: "Mono-bande", hr: "Optique", price: "219 €" },
    cta: { text: "Détails", action: "openAgent", target: null },
    targetSegmentIds: ["seg-montre"]
  },
  "off-watchC": {
    offerId: "off-watchC", kind: "editorial", brand: "Cardo",
    label: null, category: "gps-watch",
    headline: "Cardo Run S", subline: "La plus légère, parfaite pour les sorties courtes.",
    price: "179 €", swatch: ["#2b2733", "#b0607a"], photo: IMG("photo-1617043786394-f977fa12eddf"),
    specs: { battery: "18 h", weight: "39 g", gps: "Mono-bande", hr: "Optique", price: "179 €" },
    cta: { text: "Détails", action: "openAgent", target: null },
    targetSegmentIds: ["seg-montre"]
  },
  "off-hydration": {
    offerId: "off-hydration", kind: "editorial", brand: "—",
    label: null, category: "hydration",
    headline: "Gilet d'hydratation 5 L", subline: "Deux flasques souples de 500 ml à l'avant, sans ballottement.",
    price: "95 €", swatch: ["#2a3640", "#7a8a93"], photo: IMG("photo-1602143407151-7111542de6e8"),
    cta: { text: "Comment choisir", action: "openAgent", target: null },
    targetSegmentIds: ["seg-materiel"]
  },
  "off-poles": {
    offerId: "off-poles", kind: "editorial", brand: "—",
    label: null, category: "poles",
    headline: "Bâtons carbone pliables", subline: "Z-fold, 230 g la paire — pour les montées raides.",
    price: "110 €", swatch: ["#2e2a25", "#a98f6b"], photo: IMG("photo-1551632811-561732d1e306"),
    cta: { text: "Comment choisir", action: "openAgent", target: null },
    targetSegmentIds: ["seg-materiel"]
  },
  "off-nutrition": {
    offerId: "off-nutrition", kind: "sponsored", brand: "Vertic Fuel",
    label: "Sponsorisé", category: "nutrition",
    headline: "Gels Vertic Fuel", subline: "Doux pour l'estomac, 22 g de glucides chacun.",
    price: "2,40 €", swatch: ["#33291f", "#d98b3a"], photo: IMG("photo-1571748982800-fa51082c2224"),
    cta: { text: "Essayer un pack découverte", action: "openAgent", target: null },
    targetSegmentIds: ["seg-nutrition"]
  }
};

// ---------------------------------------------------------
// FLOWS AGENT SCRIPTÉS — Annexe C
// ---------------------------------------------------------
export const FLOWS = {
  "flow-drop": {
    flowId: "flow-drop", title: "drop",
    message: "Le drop, c'est la différence de hauteur entre le talon et l'avant du pied d'une chaussure, en millimètres. Un drop élevé (8–10 mm) amortit l'attaque talon ; un drop faible (0–4 mm) vous garde près du sol et sollicite davantage les mollets. Pour une première saison de trail, 6–8 mm est un bon compromis.",
    suggestedFollowups: ["flow-recommend-shoes"], offerRef: null
  },
  "flow-softflasks": {
    flowId: "flow-softflasks", title: "flasques souples",
    message: "Les flasques souples sont des bidons souples logés dans les poches avant d'un gilet d'hydratation. Elles se rétractent à mesure que vous buvez, donc rien ne ballotte contre la poitrine. Deux flasques de 500 ml à l'avant, c'est le setup débutant le plus courant.",
    suggestedFollowups: [], offerRef: "off-hydration"
  },
  "flow-poles": {
    flowId: "flow-poles", title: "bâtons",
    message: "Les bâtons déchargent les jambes dans les montées raides et vous stabilisent dans les descentes glissantes. Une paire carbone pliable (Z-fold) pèse ~230 g et se range dans un gilet. La plupart des débutants ne les sortent qu'une fois les montées devenues longues.",
    suggestedFollowups: [], offerRef: "off-poles"
  },
  "flow-dplus": {
    flowId: "flow-dplus", title: "D+",
    message: "Le D+, c'est le dénivelé positif total d'un parcours — chaque mètre grimpé, additionné. 800 m de D+ sur 20 km, c'est déjà sérieux pour une première saison. La distance seule ne dit presque rien en trail ; associez-la au D+ pour jauger l'effort réel.",
    suggestedFollowups: ["flow-summarize-plan"], offerRef: null
  },
  "flow-vo2max": {
    flowId: "flow-vo2max", title: "VO2max",
    message: "La VO2max, c'est la quantité maximale d'oxygène que votre corps peut utiliser par minute — un plafond pour l'effort aérobie soutenu. Pas besoin de courir après ce chiffre en débutant : un volume facile et régulier le fait monter tout seul sur les premiers mois.",
    suggestedFollowups: [], offerRef: null
  },
  "flow-gps": {
    flowId: "flow-gps", title: "précision GPS",
    message: "Sous couvert forestier et en fond de vallée, le GPS mono-bande peut dériver et surévaluer la distance. Le multi-bande (multi-fréquences) suit la même trace bien plus finement — la principale raison de mettre le prix si vous courez en terrain technique.",
    suggestedFollowups: ["flow-montre-compare"], offerRef: null
  },
  "flow-cardio": {
    flowId: "flow-cardio", title: "cardio au poignet",
    message: "Le cardio optique au poignet est pratique mais retarde sur les montées sèches et dans le froid. Pour de l'endurance fondamentale en zone 2, ça suffit ; si vous vous entraînez par zones précises, une ceinture pectorale reste plus honnête.",
    suggestedFollowups: [], offerRef: null
  },
  "flow-nutrition": {
    flowId: "flow-nutrition", title: "S'alimenter en course",
    message: "En dessous d'une heure, l'eau suffit. Au-delà, visez 20 à 30 g de glucides toutes les demi-heures — un gel, quelques pâtes de fruits, ou une demi-banane. La seule vraie règle : s'entraîner à le faire en sortie, jamais d'inaugurer une saveur le jour J.",
    suggestedFollowups: [], offerRef: "off-nutrition"
  },
  "flow-summarize-plan": {
    flowId: "flow-summarize-plan", title: "Le plan en 20 secondes",
    message: "Semaines 1–2 : trois sorties faciles, on marche les montées. Semaines 3–5 : on ajoute une sortie vallonnée et un peu de D+ chaque semaine. Semaines 6–7 : une sortie longue le week-end, on garde un jour de repos complet. Semaine 8 : on lève le pied, puis on court son premier trail détendu. Règle d'or : une seule chose dure par semaine.",
    suggestedFollowups: ["flow-recommend-shoes"], offerRef: null
  },
  "flow-montre-compare": {
    flowId: "flow-montre-compare", title: "Comparer 3 montres GPS",
    message: "Voici ce que valent les trois pour un débutant. Pace Labs est sponsorisé — c'est signalé ci-dessous. Northwind est la polyvalente au bon rapport qualité-prix ; Cardo est la plus légère pour les sorties courtes.",
    suggestedFollowups: [], offerRef: null, immersive: "comparator"
  },
  "flow-recommend-shoes": {
    flowId: "flow-recommend-shoes", title: "Trouver des chaussures adaptées",
    message: "Trois questions rapides et j'affine — terrain, fréquence, et budget.",
    suggestedFollowups: [], offerRef: null, immersive: "finder"
  },
  "flow-chaussure-sponsored": {
    flowId: "flow-chaussure-sponsored", title: "Saltus Ridge GTX",
    message: "Vous débutez sur du sentier technique et meuble ? La Ridge GTX est accrocheuse avec un drop de 6 mm — indulgente pour une première saison. Ceci est une recommandation sponsorisée de Saltus.",
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
      "Le trail, ce n'est pas de la route avec quelques cailloux dessus. Le sol bouge sous vos pieds, la pente ne se stabilise jamais, et l'effort arrive par vagues plutôt qu'en bourdonnement régulier. C'est tout son charme — et la raison pour laquelle vos premières sorties peuvent être humbles si vous les abordez comme un 10 km tout plat.",
      "La bonne nouvelle : bien débuter tient surtout aux attentes, pas à la forme. Réglez quelques détails et le sentier cesse de vous résister. Ce guide passe en revue le matériel qui compte vraiment, comment lire une montée, quoi manger, la question de la montre, et un plan progressif de huit semaines."
    ],
    module: null
  },
  {
    id: "seg-materiel", order: 2, title: "Le matériel qui change vraiment les choses",
    nativeAdDensity: 0.12,
    paras: [
      "Il en faut bien moins que ce que suggèrent les boutiques, mais trois choses changent réellement l'expérience. Les chaussures d'abord. Une chaussure de trail troque l'amorti de la route contre l'accroche — des crampons plus profonds qui mordent la boue et une gomme qui tient sur le rocher mouillé. L'autre chiffre à connaître, c'est le {{term-drop}}, qui décide de la façon dont la chaussure sollicite vos jambes sur les longues descentes.",
      "L'hydratation ensuite. Un gilet léger avec deux {{term-softflasks}} à l'avant garde l'eau à portée et les mains libres, ce qui compte plus que la contenance sur tout ce qui dure moins de deux heures.",
      "Enfin, optionnel au début : les {{term-poles}}. La plupart des débutants les ignorent jusqu'à leur première vraie montée raide, puis n'y renoncent plus."
    ],
    module: {
      type: "recommend", label: "Trouver des chaussures adaptées",
      flowId: "flow-recommend-shoes", offerIds: ["off-shoeA"]
    }
  },
  {
    id: "seg-denivele", order: 3, title: "Lire la montée",
    nativeAdDensity: 0.08,
    paras: [
      "En trail, la distance ment. Douze kilomètres peuvent être un footing ou un chemin de croix selon un seul chiffre : le {{term-dplus}}. Apprenez à le lire et vous gérerez des montées inconnues avec un calme surprenant.",
      "La technique qui sauve les débutants, ce n'est pas de courir plus fort — c'est de marcher. Marcher vite dans les passages raides garde votre cœur loin du plafond et vos jambes intactes pour le sommet. Pas besoin d'une grosse {{term-vo2max}} pour aimer ça ; il faut surtout en dépenser moins au mauvais endroit."
    ],
    module: null
  },
  {
    id: "seg-nutrition", order: 4, title: "S'alimenter en mouvement",
    nativeAdDensity: 0.10,
    paras: [
      "En dessous d'une heure, l'eau suffit. Au-delà, le corps réclame un petit apport régulier de glucides — comptez 20 à 30 grammes toutes les demi-heures plutôt qu'une grosse dose quand vous êtes déjà à plat.",
      "Les gels sont l'option compacte ; les pâtes de fruits et une banane dans le sac font tout aussi bien l'affaire. La seule vraie règle : s'entraîner à le faire en sortie, jamais d'inaugurer une nouvelle saveur le matin de la course."
    ],
    module: null
  },
  {
    id: "seg-montre", order: 5, title: "Votre première montre GPS",
    nativeAdDensity: 0.16,
    paras: [
      "La montre est le seul équipement où dépenser plus achète réellement de la précision. Les deux choses qui séparent une montre à 179 € d'une à 329 €, c'est la {{term-gps}} et l'autonomie — le reste est surtout du logiciel.",
      "N'achetez pas trop. Le {{term-cardio}} suffit pour de l'endurance fondamentale tranquille, et 18 heures d'autonomie couvrent bien plus que ce qu'un débutant courra jamais d'une traite. Accordez la montre à la course que vous ferez vraiment, pas à celle que vous imaginez."
    ],
    module: {
      type: "compare", label: "Comparer ces 3 montres GPS",
      flowId: "flow-montre-compare", offerIds: ["off-watchA", "off-watchB", "off-watchC"]
    }
  },
  {
    id: "seg-plan", order: 6, title: "Le plan progressif sur huit semaines",
    nativeAdDensity: 0.06,
    paras: [
      "On peut être prêt pour le trail en deux mois sans se détruire. La logique est simple : construire du volume facile d'abord, ajouter un peu de dénivelé chaque semaine, et protéger un jour de repos complet comme un entraînement — parce que c'en est un.",
      "L'erreur de débutant la plus courante, c'est d'enchaîner deux choses dures la même semaine. Une seule séance de qualité — une sortie vallonnée ou une sortie longue — suffit. Tout le reste reste conversationnel."
    ],
    module: null
  },
  {
    id: "seg-conclusion", order: 7, title: "Vos premiers pas",
    nativeAdDensity: 0.04,
    paras: [
      "Choisissez un parcours avec un D+ modeste, marchez les montées sans culpabiliser, emportez un peu d'eau et une collation, et laissez la montre tranquille à votre poignet. Le sentier récompense la patience bien plus que l'ambition.",
      "Si vous ne réglez qu'une seule chose avant de partir, que ce soient les chaussures. Réussissez-les et la première saison sera un plaisir plutôt qu'un combat."
    ],
    module: {
      type: "recommend", label: "Trouve ta chaussure",
      flowId: "flow-recommend-shoes", offerIds: ["off-shoeA"], hero: true
    }
  }
];

export const ARTICLE = {
  articleId: "trail-debutant-001",
  vertical: "sport / outdoor",
  kicker: "Trail running · Pour bien débuter",
  title: "Bien débuter le trail sans se cramer dès les premières montées",
  dek: "Moins de matériel qu'on ne croit, un chiffre qui compte plus que la distance, et un plan de huit semaines qui ne vous brisera pas.",
  author: "La rédaction",
  date: "Juin 2026",
  readTime: "7 min de lecture",
  heroPhoto: IMG("photo-1486218119243-13883505764c", 1280),
  heroCaption: "Photo · sortie trail sur sentier de campagne",
  segmentIds: SEGMENTS.map(s => s.id)
};

// ---------------------------------------------------------
// CONFIG / GOUVERNANCE (PRD §8, §9) — hooks, pas de valeurs de style
// ---------------------------------------------------------
export const CONFIG = {
  levels: { enabled: { N1: true, N2: true, N3: true, N4: true, N5: true } },
  agentMode: "scripted",
  governance: {
    maxSolicitationsPerSession: 4,
    cooldownBetweenSolicitations: 6000,   // ms
    scrollAwakeThreshold: 0.18,           // fraction de l'article scrollée
    dwellAwakeMs: 650,                    // apparition quasi-instantanée à la pause de scroll
    moduleViewportThreshold: 0.6,
    nativeDensityCap: 0.30
  }
};

// teasers que la bulle ambiante peut faire surgir, rattachés à un segment
export const TEASERS = [
  { id: "tz-shoe",  segmentId: "seg-materiel",   line: "Pas sûr de votre chaussure de trail ? Saltus peut aider.", flowId: "flow-chaussure-sponsored", sponsored: true },
  { id: "tz-dplus", segmentId: "seg-denivele",   line: "Le « D+ » revient souvent — je vous l'explique en une ligne ?", flowId: "flow-dplus", sponsored: false },
  { id: "tz-fuel",  segmentId: "seg-nutrition",  line: "Combien faut-il vraiment manger en course ?", flowId: "flow-nutrition", sponsored: false },
  { id: "tz-watch", segmentId: "seg-montre",     line: "On compare les 3 montres GPS ?", flowId: "flow-montre-compare", sponsored: false },
  { id: "tz-plan",  segmentId: "seg-plan",       line: "Le plan de 8 semaines en 20 secondes ?", flowId: "flow-summarize-plan", sponsored: false },
  { id: "tz-find",  segmentId: "seg-conclusion", line: "Prêt à trouver votre première paire ?", flowId: "flow-recommend-shoes", sponsored: false }
];

// N2' — teasers "média" : la bulle morphe au scroll en lien vers un article / une vidéo.
// (a `thumb` => rendu en carte média ; sinon teaser ligne classique.)
export const MEDIA_TEASERS = [
  { id: "mz-watch", segmentId: "seg-montre", kind: "video", source: "Terrain · Vidéo", title: "Test terrain : 3 montres GPS comparées", meta: "4:12", thumb: IMG("photo-1508685096489-7aacd43bd3b1", 480), flowId: "flow-montre-compare", sponsored: false },
  { id: "mz-dplus", segmentId: "seg-denivele", kind: "article", source: "Terrain · Guide", title: "Bien lire le D+ et doser l'effort en montée", meta: "5 min", thumb: IMG("photo-1551632811-561732d1e306", 480), flowId: "flow-dplus", sponsored: false },
  { id: "mz-plan", segmentId: "seg-plan", kind: "article", source: "Terrain · Plan", title: "Le plan de 8 semaines, semaine par semaine", meta: "6 min", thumb: IMG("photo-1486218119243-13883505764c", 480), flowId: "flow-summarize-plan", sponsored: false }
];
