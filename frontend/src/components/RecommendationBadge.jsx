import React from "react";

export default function RecommendationBadge({ recommendation }) {
  const map = {
    BUY: "badge-buy",
    HOLD: "badge-hold",
    PASS: "badge-pass",
  };
  const cls = map[recommendation] || "badge-neutral";
  return <span className={`badge ${cls}`}>{recommendation || "PENDING"}</span>;
}
