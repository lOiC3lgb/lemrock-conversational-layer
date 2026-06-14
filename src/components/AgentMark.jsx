/* ============================================================
   AgentMark.jsx — the sparkle brand mark + small avatar
   Monochrome, like the reference. Extracted as a leaf module so the
   conversation engine and the agent surfaces can share it without a cycle.
   ============================================================ */

// ---- companion brand mark (monochrome, filled with `color` so it reads on
//      any background). Traced from the supplied icon: a rounded square with
//      the top-left corner sliced off by a diagonal. ----
export function AgentMark({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path
        d="M12.4 3.2 H18.6 A2.2 2.2 0 0 1 20.8 5.4 V18.6 A2.2 2.2 0 0 1 18.6 20.8 H5.4 A2.2 2.2 0 0 1 3.2 18.6 V12.4 Z"
        fill={color}
      />
    </svg>
  );
}

export function Avatar() {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
      background: "var(--accent)", color: "var(--ink-inverse)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <AgentMark size={14} color="#fff" />
    </div>
  );
}
