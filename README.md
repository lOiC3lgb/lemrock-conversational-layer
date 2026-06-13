# Lemrock — Conversational Media Layer (Trail Demonstrator)

A working demonstrator of a **conversational layer** that mounts on top of an existing
media article. It proves three things from the product brief: it can **drive interaction**
with an agent without reducing it to a static bottom-right chatbot, **monetise natively**
through contextual sponsored formats, and **integrate without a redesign** of the host page.

The demo article is an English trail-running guide; the layer expresses itself across a
**five-level scale of presence** (discreet → present) and is fully instrumented and
governed (attention budget, opt-out, Better-Ads compliance).

This is a real React app (Vite) recreated from an HTML/JS prototype exported from
[Claude Design](https://claude.ai/design). See **Provenance** below.

---

## The five presence levels

| Level | Name | How it shows up | Initiative |
|------|------|-----------------|------------|
| **N1** | Lexical | Augmented terms inline in the text (`drop`, `soft flasks`, `poles`, `D+`, `VO2max`, `GPS accuracy`, `wrist heart-rate`) open an anchored glass popover. Never confusable with a link. | 100% reader (pull) |
| **N2** | Ambient | A living, breathing bubble launcher: `dormant → awake → teaser → semiOpen`. Never open at load; teasers auto-retract; governed by the attention budget. | Soft push |
| **N3** | Contextual | In-flow modules (`compare`, `recommend`) that rise in at the visibility threshold with reserved space (no layout shift). One per segment. | Contextual push |
| **N4** | Sponsored | A single `SponsoredFrame` shell renders every paid/editorial surface (inline card, mini row, in-thread card). Always labelled + brand; editorial offers are visibly distinct. Viewability impression after ≥50% visible ≥1s. | Commercial |
| **N5** | Immersive | An earned takeover after an explicit action — a **conversation-first** GPS-watch comparator and a "find your shoe" finder. The article dims but stays in the DOM; closing restores the exact reading position. | Earned (explicit) |

**Consent ladder:** the layer never jumps up a level without a reader signal. Presence is
earned by engagement.

### Conversation everywhere + free-text composer
The docked agent and both N5 flows use one shared conversation engine: agent/reader
bubbles, a typing indicator, quick replies, and product cards woven into the thread. Every
surface has a **free-text composer** — typed questions are routed by keyword intent-matching
(scripted demo mode) to the right answer or to the finder/comparator, with a graceful
fallback.

### Governance & compliance (built in)
Attention-budget cap + cooldown, native-ad-density anti-collision, one-gesture **opt-out**,
a **live Events panel** proving the §12 taxonomy fires, a Better-Ads-compliant badge, and
full `prefers-reduced-motion` support.

### Tweaks panel (top-right)
Toggle each level N1–N5, set the solicitation budget & cooldown, simulate a dense-ad
segment (to watch suppression fire), flip the GBX coral accent, and force reduced motion.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

### Demo script
Read the article → tap a term like **D+** (N1) → keep scrolling until the bubble teases a
watch comparison (N2) → open **Compare these 3 GPS watches** (N3) → it opens the immersive
comparator conversation (N5) with a labelled **sponsored** card and an editorial alternative
(N4) → ask a follow-up or type your own question → **Back to reading** restores your spot →
open **Events** (bottom-left) to see the taxonomy, and **Don't solicit me** to opt out.

---

## Project structure

```
index.html                 Vite entry — Phosphor icons + Newsreader font links
src/
  main.jsx                 mounts <App/> into #root
  App.jsx                  assembles the layer, scroll/dwell signals, the Tweaks panel
  data/
    data.js                article, offer catalogue, scripted agent flows, governance config
    conversations.js       node-based dialogue scripts (finder / comparator)
    index.js               composes the single DEMO object
  store/
    store.js               PresenceController + governance + event bus (useSyncExternalStore)
  components/
    AgentMark.jsx          sparkle brand mark + avatar (shared leaf)
    SponsoredFrame.jsx     the single monetisation shell (N4) + viewability
    Chat.jsx               shared conversation engine (bubbles, quick replies, composer, cards)
    Agent.jsx              docked agent panel + N1 lexical popover
    AmbientBubble.jsx      N2 living bubble state machine
    ContextualModule.jsx   N3 in-flow modules
    ImmersivePanel.jsx     N5 takeover (hosts a conversation)
    EventsPanel.jsx        compliance dock, event stream, level badge, suppression toast
    Article.jsx            the host media page (editorial serif; layer mounts non-destructively)
    TweaksPanel.jsx        floating tweaks shell + control primitives
  styles/
    tokens.css             design tokens (fonts, GBX neutrals, glass, motion)
    styles.css             layout & motion for every surface
public/fonts/              Plus Jakarta Sans (agent layer); Newsreader (editorial) via CDN
```

### Design language
- **Editorial layer = Newsreader (serif); agent layer = Plus Jakarta Sans (GBX).** The
  font split keeps the companion visually distinct from running text — a PRD requirement.
- Neutral, glassy agent that recedes behind the article. GBX coral stays out by default
  and is toggleable in Tweaks.

---

## Provenance & porting notes

Recreated from the **Claude Design** handoff bundle in `lemrock/` (kept for reference: the
original HTML/JS prototype, the PRD, the chat transcript, and screenshots). The prototype
was React delivered via in-browser Babel + CDN globals; this app is the production form:

- `window.*` globals → ES module imports/exports; in-browser Babel → Vite build.
- The Tweaks panel's design-host `postMessage` edit-mode protocol → a self-contained
  floating launcher backed by local React state.
- Newsreader moved from a CSS `@import` to a `<link>` (a misplaced `@import` is dropped on
  bundling); fonts served from `public/fonts/`.
- No `<StrictMode>`: the presence state machines rely on effects/timers not being
  double-invoked, matching the prototype's behaviour.

Scope note: the agent runs in deterministic **scripted** mode (the PRD's default). The `llm`
mode hook exists in the data model but isn't wired to a live endpoint. Product imagery uses
clean labelled placeholders.
