import React, { useState, useRef, useEffect } from "react";
import { createResearchRequest } from "../api/researchApi.js";
import ProgressTimeline, { PIPELINE_STEPS } from "../components/ProgressTimeline.jsx";
import ReportViewer from "../components/ReportViewer.jsx";
import { ReportSkeleton } from "../components/Skeletons.jsx";
import "../styles/research.css";

const EXAMPLE_COMPANIES = ["Apple", "Tesla", "Microsoft", "Google", "Amazon", "NVIDIA"];

export default function ResearchPage() {
  const [companyName, setCompanyName] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const tickerRef = useRef(null);

  useEffect(() => () => clearInterval(tickerRef.current), []);

  const runPipeline = async (name) => {
    if (!name.trim() || isRunning) return;
    setIsRunning(true);
    setResult(null);
    setError("");
    setActiveIndex(0);

    // Simulated real-time reveal of pipeline steps while the actual
    // request runs in the background, then reconciled with real progress.
    let step = 0;
    tickerRef.current = setInterval(() => {
      step += 1;
      if (step < PIPELINE_STEPS.length - 1) {
        setActiveIndex(step);
      }
    }, 900);

    try {
      const res = await createResearchRequest(name.trim());
      clearInterval(tickerRef.current);
      setActiveIndex(PIPELINE_STEPS.length - 1);
      setTimeout(() => {
        setResult(res.data);
        if (res.data.status !== "COMPLETED") {
          setError(res.data.errors?.[0] || "The research pipeline could not complete.");
        }
      }, 400);
    } catch (err) {
      clearInterval(tickerRef.current);
      setError(err.message);
    } finally {
      setTimeout(() => setIsRunning(false), 500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runPipeline(companyName);
  };

  return (
    <div className="research-page">
      <header className="research-header">
        <span className="eyebrow mono">New Research</span>
        <h1>Which company should we analyze?</h1>
        <p className="research-sub">
          Enter a public company and the Investment Research Agent will run a full multi-agent analysis —
          financials, news, sentiment, risk, and a final recommendation.
        </p>
      </header>

      <form className="company-search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. Apple, Tesla, Microsoft..."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={isRunning}
        />
        <button type="submit" className="btn btn-primary" disabled={isRunning || !companyName.trim()}>
          {isRunning ? "Analyzing…" : "Run Research"}
        </button>
      </form>

      <div className="example-chips">
        {EXAMPLE_COMPANIES.map((name) => (
          <button
            key={name}
            className="chip"
            disabled={isRunning}
            onClick={() => {
              setCompanyName(name);
              runPipeline(name);
            }}
            type="button"
          >
            {name}
          </button>
        ))}
      </div>

      {isRunning && (
        <div className="pipeline-panel">
          <h3>Agent Pipeline</h3>
          <ProgressTimeline activeIndex={activeIndex} completedSteps={result?.progress?.map((p) => p.step) || []} />
        </div>
      )}

      {isRunning && !result && <ReportSkeleton />}

      {error && !isRunning && <div className="form-error">{error}</div>}

      {result && result.status === "COMPLETED" && (
        <ReportViewer companyName={companyName} ticker={result.ticker} report={result.report} />
      )}
    </div>
  );
}
