/* ============================================================
   AgentMark.jsx — the companion brand mark + small avatar
   The supplied avatar (src/assets/companion-avatar.svg), inlined so it
   can be filled with `color` and reads on any background (white on the
   dark orb, dark on light). Shared leaf so every surface uses one mark.
   ============================================================ */

export function AgentMark({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path
        d="M7.51742 16.8997L13.6604 1.36778C13.9199 0.711446 13.4363 0 12.7305 0H1C0.447715 0 0 0.447714 0 0.999999V30.992C0 31.5443 0.447714 31.992 0.999999 31.992H30.992C31.5443 31.992 31.992 31.5443 31.992 30.992V1C31.992 0.447715 31.5443 0 30.992 0H28.4192C28.1623 0 27.9153 0.0988389 27.7294 0.276029L9.13715 17.9915C8.36107 18.731 7.12316 17.8966 7.51742 16.8997Z"
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
