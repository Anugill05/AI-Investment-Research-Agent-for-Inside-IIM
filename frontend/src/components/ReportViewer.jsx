import React from "react";
import ConfidenceGauge from "./ConfidenceGauge.jsx";
import RecommendationBadge from "./RecommendationBadge.jsx";

const SECTIONS = [
  { key: "companyOverview", title: "Company Overview" },
  { key: "financialHealth", title: "Financial Health" },
  { key: "revenueAnalysis", title: "Revenue Analysis" },
  { key: "profitabilityAnalysis", title: "Profitability Analysis" },
  { key: "valuationSummary", title: "Valuation Summary" },
  { key: "newsSummary", title: "Latest News Summary" },
  { key: "marketSentiment", title: "Market Sentiment" },
  { key: "riskAnalysis", title: "Risk Analysis" },
  { key: "opportunities", title: "Opportunities" },
];

export default function ReportViewer({ companyName, ticker, report }) {
  if (!report) return null;

  return (
    <div className="report-viewer">
      <div className="report-hero">
        <div className="report-hero-main">
          <span className="eyebrow mono">{ticker || "—"}</span>
          <h2>{companyName}</h2>
          <div className="report-hero-meta">
            <RecommendationBadge recommendation={report.recommendation} />
          </div>
          <p className="report-thesis">{report.finalRecommendation}</p>
        </div>
        <ConfidenceGauge score={report.confidenceScore} recommendation={report.recommendation} />
      </div>

      <div className="report-card reasoning-card">
        <h3>AI Reasoning</h3>
        <p>{report.aiReasoning}</p>
      </div>

      <div className="report-grid">
        {SECTIONS.map(({ key, title }) => (
          <div className="report-card" key={key}>
            <h3>{title}</h3>
            <p>{report[key] || "Not available."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
