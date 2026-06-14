/* ============================================================
   conversations.js — dialogues scriptés (nœuds) pour N5 (PRD §7.5)
   Conversation d'abord : l'agent parle, le lecteur répond par des
   réponses rapides, des cartes produit sont tissées dans le fil.
   Nœud = { agent:[ "texte" | {card} | {compare:[ids]} ], options:[{label,to,ack?,set?,immersive?,reset?}] }
   ============================================================ */

const FINDER = {
  start: {
    agent: [
      "Trouvons votre première paire — juste trois questions rapides, puis un choix qui vous va vraiment.",
      "Où courez-vous le plus souvent ?"
    ],
    options: [
      { label: "Chemins roulants", ack: "Terrain roulant — du confort avec un peu d'accroche fera l'affaire.", set: { terrain: "smooth" }, to: "freq" },
      { label: "Sentiers mixtes", ack: "Sentiers mixtes — donc une polyvalente.", set: { terrain: "mixed" }, to: "freq" },
      { label: "Technique & boueux", ack: "Technique et boueux — alors l'accroche est ce qui compte le plus.", set: { terrain: "tech" }, to: "freq" }
    ]
  },
  freq: {
    agent: ["Bien. Et à quelle fréquence sortirez-vous vraiment ?"],
    options: [
      { label: "Une fois/semaine", ack: "Une fois par semaine — je privilégie la durabilité au poids.", set: { freq: "1" }, to: "budget" },
      { label: "2–3 fois", ack: "Deux ou trois fois — une vraie chaussure du quotidien, alors.", set: { freq: "23" }, to: "budget" },
      { label: "4 fois et +", ack: "Quatre et plus — il faut que ça encaisse les kilomètres.", set: { freq: "4" }, to: "budget" }
    ]
  },
  budget: {
    agent: ["Dernière question — votre budget ?"],
    options: [
      { label: "Moins de 100 €", ack: "Budget serré, noté — le chaussant d'abord, le superflu ensuite.", set: { budget: "low" }, to: "result" },
      { label: "100–180 €", ack: "C'est le sweet spot pour une première chaussure de trail.", set: { budget: "mid" }, to: "result" },
      { label: "Flexible", ack: "Flexible — on peut prioriser le bon ressenti, alors.", set: { budget: "flex" }, to: "result" }
    ]
  },
  result: {
    agent: [
      "En recoupant tout ça — accrocheuse, indulgente, faite pour le terrain meuble. Voici le meilleur match. C'est un choix sponsorisé, donc je le signale clairement, et il y a une alternative éditoriale en dessous.",
      { card: "off-shoeA" },
      { card: "off-hydration" },
      "C'est une suggestion, jamais une obligation — fermez quand vous voulez et vous revenez exactement où vous étiez dans l'article."
    ],
    options: [
      { label: "Pourquoi celle-ci ?", to: "why" },
      { label: "Recommencer", to: "start", reset: true }
    ]
  },
  why: {
    agent: ["La Ridge GTX a un drop indulgent de 6 mm avec des crampons agressifs — de l'accroche sur terrain meuble et technique sans punir les jambes en descente. Pour une première saison boueuse, c'est la paire sûre pour apprendre."],
    options: [{ label: "Recommencer", to: "start", reset: true }]
  }
};

const COMPARATOR = {
  start: {
    agent: [
      "Avec plaisir, comparons les trois ensemble.",
      "Qu'est-ce qui compte le plus pour votre première montre GPS ?"
    ],
    options: [
      { label: "Autonomie", to: "batt" },
      { label: "Prix", to: "price" },
      { label: "Précision GPS", to: "gps" },
      { label: "Montre-les toutes les 3", to: "all" }
    ]
  },
  batt: {
    agent: [
      "Côté autonomie, la Pace Labs Apex 2 mène — 38 heures de suivi GPS. À savoir, c'est l'option sponsorisée, donc je le signale. La Northwind offre un solide 26 heures pour bien moins cher.",
      { card: "off-watchA" },
      { card: "off-watchB" }
    ],
    options: [{ label: "Tu prendrais laquelle ?", to: "pick" }, { label: "Voir les trois", to: "all" }]
  },
  price: {
    agent: [
      "Côté prix, la Cardo Run S est la plus légère et la moins chère à 179 € — parfaite pour les sorties courtes. La Northwind est à 219 € et en fait nettement plus.",
      { card: "off-watchC" },
      { card: "off-watchB" }
    ],
    options: [{ label: "Tu prendrais laquelle ?", to: "pick" }, { label: "Voir les trois", to: "all" }]
  },
  gps: {
    agent: [
      "Pour la précision sous couvert forestier, seule la Pace Labs Apex 2 a un GPS double-bande — elle suit bien plus finement en terrain technique. C'est la sponsorisée, signalée ici. Les deux autres sont mono-bande et très bien en terrain dégagé.",
      { card: "off-watchA" }
    ],
    options: [{ label: "Tu prendrais laquelle ?", to: "pick" }, { label: "Voir les trois", to: "all" }]
  },
  all: {
    agent: [
      "Les voici côte à côte — mêmes critères pour les trois, sponsorisée clairement marquée.",
      { compare: ["off-watchA", "off-watchB", "off-watchC"] }
    ],
    options: [{ label: "Tu prendrais laquelle ?", to: "pick" }]
  },
  pick: {
    agent: [
      "Honnêtement ? Pour une première saison, je prendrais la Northwind Trail 50 — c'est la polyvalente au bon prix et vous ne la dépasserez pas avant longtemps. Montez vers la Pace Labs seulement si vous courez souvent en terrain technique (et oui, c'est la sponsorisée — je préfère que vous le sachiez).",
      { card: "off-watchB" }
    ],
    options: [{ label: "Recommencer la comparaison", to: "start" }]
  }
};

export const CONV = { finder: FINDER, comparator: COMPARATOR };
