import React from "react";

export default function AuthBackground({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Ambient moving glow (loop-friendly, subtle) */}
      <div className="absolute inset-0">
        <div className="absolute -inset-40 blur-3xl opacity-70 animate-[authFloat_12s_ease-in-out_infinite] bg-[radial-gradient(circle_at_30%_30%,rgba(0,240,255,0.22),transparent_55%)]" />
        <div className="absolute -inset-40 blur-3xl opacity-60 animate-[authFloat2_16s_ease-in-out_infinite] bg-[radial-gradient(circle_at_70%_60%,rgba(194,255,255,0.16),transparent_55%)]" />
        <div className="absolute -inset-40 blur-3xl opacity-45 animate-[authFloat3_20s_ease-in-out_infinite] bg-[radial-gradient(circle_at_50%_85%,rgba(0,239,255,0.12),transparent_60%)]" />
      </div>

      {/* Dark overlay so content stays the focus */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Tiny grain for premium feel (optional but nice) */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.45%22/%3E%3C/svg%3E')",
        }}
      />

      {/* Page content */}
      <div className="relative z-10 min-h-screen">{children}</div>

      {/* Keyframes */}
      <style>{`
        @keyframes authFloat {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(30px,-18px,0) scale(1.06); }
        }
        @keyframes authFloat2 {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-24px,16px,0) scale(1.07); }
        }
        @keyframes authFloat3 {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(12px,26px,0) scale(1.04); }
        }
      `}</style>
    </div>
  );
}
