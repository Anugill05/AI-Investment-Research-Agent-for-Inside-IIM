import React from "react";

/**
 * Signature element: a circular confidence gauge showing the AI's
 * confidence score (0-100) with a color derived from the recommendation.
 */
export default function ConfidenceGauge({ score = 0, recommendation = "HOLD" }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  const colorVar =
    recommendation === "BUY"
      ? "var(--signal-green)"
      : recommendation === "PASS"
      ? "var(--signal-red)"
      : "var(--signal-amber)";

  return (
    <div className="confidence-gauge">
      <svg viewBox="0 0 140 140" width="140" height="140">
        <circle cx="70" cy="70" r={radius} className="gauge-track" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={colorVar}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          className="gauge-progress"
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-score">{score}</span>
        <span className="gauge-label">confidence</span>
      </div>
    </div>
  );
}
