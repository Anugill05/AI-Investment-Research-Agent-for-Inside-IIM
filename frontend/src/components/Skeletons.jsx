import React from "react";

export function ReportSkeleton() {
  return (
    <div className="report-skeleton">
      <div className="skeleton" style={{ height: 32, width: "40%", marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 140, width: "100%", marginBottom: 20, borderRadius: 16 }} />
      <div className="report-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
        ))}
      </div>
    </div>
  );
}

export function HistoryRowSkeleton() {
  return <div className="skeleton" style={{ height: 68, width: "100%", borderRadius: 12, marginBottom: 12 }} />;
}

export default { ReportSkeleton, HistoryRowSkeleton };
