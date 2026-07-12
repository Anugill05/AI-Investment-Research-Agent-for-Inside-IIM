import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistoryRequest, deleteHistoryRequest } from "../api/researchApi.js";
import RecommendationBadge from "../components/RecommendationBadge.jsx";
import { HistoryRowSkeleton } from "../components/Skeletons.jsx";
import "../styles/history.css";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await getHistoryRequest();
      setItems(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    const prev = items;
    setItems((cur) => cur.filter((i) => i.id !== id));
    try {
      await deleteHistoryRequest(id);
    } catch (err) {
      setError(err.message);
      setItems(prev);
    }
  };

  return (
    <div className="history-page">
      <header className="research-header">
        <span className="eyebrow mono">Research History</span>
        <h1>Your past reports</h1>
        <p className="research-sub">Every research run you've kicked off, saved and ready to revisit.</p>
      </header>

      {error && <div className="form-error">{error}</div>}

      {loading && (
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <HistoryRowSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <p>No research yet. Run your first analysis to see it here.</p>
          <Link to="/app" className="btn btn-primary">
            Start Research
          </Link>
        </div>
      )}

      {!loading &&
        items.map((item) => (
          <div className="history-row" key={item.id}>
            <Link to={`/app/history/${item.id}`} className="history-row-main">
              <div className="history-row-title">
                <span className="history-company">{item.companyName}</span>
                {item.ticker && <span className="mono history-ticker">{item.ticker}</span>}
              </div>
              <span className="history-date">{new Date(item.createdAt).toLocaleString()}</span>
            </Link>
            <div className="history-row-status">
              {item.status === "COMPLETED" ? (
                <RecommendationBadge recommendation={item.recommendation} />
              ) : (
                <span className="badge badge-neutral">{item.status}</span>
              )}
              {item.confidenceScore != null && (
                <span className="mono history-confidence">{item.confidenceScore}%</span>
              )}
              <button className="btn btn-danger-ghost history-delete" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
