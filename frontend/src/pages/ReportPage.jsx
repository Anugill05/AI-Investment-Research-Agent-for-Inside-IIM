import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getHistoryDetailRequest } from "../api/researchApi.js";
import ReportViewer from "../components/ReportViewer.jsx";
import { ReportSkeleton } from "../components/Skeletons.jsx";
import "../styles/research.css";

export default function ReportPage() {
  const { id } = useParams();
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getHistoryDetailRequest(id)
      .then((res) => setResearch(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ReportSkeleton />;

  if (error) {
    return (
      <div className="empty-state">
        <p>{error}</p>
        <Link to="/app/history" className="btn btn-primary">
          Back to History
        </Link>
      </div>
    );
  }

  if (!research?.report) {
    return (
      <div className="empty-state">
        <p>This research run did not complete: {research?.errorMessage || "Unknown error."}</p>
        <Link to="/app/history" className="btn btn-primary">
          Back to History
        </Link>
      </div>
    );
  }

  const report = {
    ...research.report,
    recommendation: research.recommendation,
    confidenceScore: research.confidenceScore,
  };

  return (
    <div className="research-page">
      <ReportViewer companyName={research.companyName} ticker={research.ticker} report={report} />
    </div>
  );
}
