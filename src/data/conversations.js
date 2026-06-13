/* ============================================================
   conversations.js — node-based dialogue scripts for N5 (PRD §7.5)
   Conversation-first: the agent talks, the reader replies with quick
   replies, product cards are woven into the thread.
   Node = { agent:[ "text" | {card} | {compare:[ids]} ], options:[{label,to,ack?,set?,immersive?,reset?}] }
   ============================================================ */

const FINDER = {
  start: {
    agent: [
      "Let's find your first pair — just three quick questions, then a pick that actually fits you.",
      "Where will you run most of the time?"
    ],
    options: [
      { label: "Smooth paths", ack: "Smooth ground — comfort with a bit of grip will do nicely.", set: { terrain: "smooth" }, to: "freq" },
      { label: "Mixed trails", ack: "Mixed trails — so a versatile all-rounder.", set: { terrain: "mixed" }, to: "freq" },
      { label: "Technical & muddy", ack: "Technical and muddy — then grip is the thing that matters most.", set: { terrain: "tech" }, to: "freq" }
    ]
  },
  freq: {
    agent: ["Good. And how often will you realistically get out?"],
    options: [
      { label: "Once a week", ack: "Once a week — I'll lean toward durability over weight.", set: { freq: "1" }, to: "budget" },
      { label: "2–3 times", ack: "Two or three times — a proper daily-driver, then.", set: { freq: "23" }, to: "budget" },
      { label: "4+ times", ack: "Four-plus — you'll want something that survives the miles.", set: { freq: "4" }, to: "budget" }
    ]
  },
  budget: {
    agent: ["Last one — what's your budget?"],
    options: [
      { label: "Under $100", ack: "Tight budget, noted — fit first, frills later.", set: { budget: "low" }, to: "result" },
      { label: "$100–180", ack: "That's the sweet spot for a first trail shoe.", set: { budget: "mid" }, to: "result" },
      { label: "Flexible", ack: "Flexible — then we can prioritise the right ride.", set: { budget: "flex" }, to: "result" }
    ]
  },
  result: {
    agent: [
      "Putting that together — grippy, forgiving, built for soft ground. Here's the closest match. It's a sponsored pick, so I'm flagging it clearly, and there's an editorial alternative underneath.",
      { card: "off-shoeA" },
      { card: "off-hydration" },
      "That's a suggestion, never a push — close any time and you're back exactly where you left off in the article."
    ],
    options: [
      { label: "Why this one?", to: "why" },
      { label: "Start over", to: "start", reset: true }
    ]
  },
  why: {
    agent: ["The Ridge GTX runs a forgiving 6 mm drop with aggressive lugs — grip on soft, technical ground without punishing your legs on the descents. For a first muddy season it's the safe pair to learn on."],
    options: [{ label: "Start over", to: "start", reset: true }]
  }
};

const COMPARATOR = {
  start: {
    agent: [
      "Happy to compare the three with you.",
      "What matters most for your first GPS watch?"
    ],
    options: [
      { label: "Battery life", to: "batt" },
      { label: "Price", to: "price" },
      { label: "GPS accuracy", to: "gps" },
      { label: "Just show me all three", to: "all" }
    ]
  },
  batt: {
    agent: [
      "On battery, the Pace Labs Apex 2 leads — 38 hours of GPS tracking. Worth knowing it's the sponsored option, so I'm flagging it. The Northwind gives you a healthy 26 hours for a lot less money.",
      { card: "off-watchA" },
      { card: "off-watchB" }
    ],
    options: [{ label: "Which would you pick?", to: "pick" }, { label: "See all three", to: "all" }]
  },
  price: {
    agent: [
      "For price, the Cardo Run S is lightest and cheapest at $179 — lovely for shorter outings. The Northwind is $219 and does noticeably more.",
      { card: "off-watchC" },
      { card: "off-watchB" }
    ],
    options: [{ label: "Which would you pick?", to: "pick" }, { label: "See all three", to: "all" }]
  },
  gps: {
    agent: [
      "For accuracy under tree cover, only the Pace Labs Apex 2 has dual-band GPS — it tracks far tighter on technical trails. It's the sponsored one, flagged here. The other two are single-band and perfectly fine on open ground.",
      { card: "off-watchA" }
    ],
    options: [{ label: "Which would you pick?", to: "pick" }, { label: "See all three", to: "all" }]
  },
  all: {
    agent: [
      "Here they are side by side — same criteria for all three, sponsored clearly marked.",
      { compare: ["off-watchA", "off-watchB", "off-watchC"] }
    ],
    options: [{ label: "Which would you pick?", to: "pick" }]
  },
  pick: {
    agent: [
      "Honestly? For a first season I'd take the Northwind Trail 50 — it's the value all-rounder and you won't outgrow it for a while. Step up to the Pace Labs only if you'll run technical terrain often (and yes, that's the sponsored one — I'd rather you knew).",
      { card: "off-watchB" }
    ],
    options: [{ label: "Start the comparison over", to: "start" }]
  }
};

export const CONV = { finder: FINDER, comparator: COMPARATOR };
