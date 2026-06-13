/* ============================================================
   AgentMark.jsx — the sparkle brand mark + small avatar
   Monochrome, like the reference. Extracted as a leaf module so the
   conversation engine and the agent surfaces can share it without a cycle.
   ============================================================ */

// ---- the sparkle brand mark (monochrome, like the reference) ----
export function AgentMark({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path d="M12 1.6c.5 4.6 1.9 8 4.6 9.5C13.9 12.6 12.5 16 12 20.6 11.5 16 10.1 12.6 7.4 11.1 10.1 9.6 11.5 6.2 12 1.6Z" fill={color} />
      <path d="M19.5 13.2c.27 2 1 3.4 2.5 4.1-1.5.7-2.23 2.1-2.5 4.1-.27-2-1-3.4-2.5-4.1 1.5-.7 2.23-2.1 2.5-4.1Z" fill={color} opacity="0.78" />
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
