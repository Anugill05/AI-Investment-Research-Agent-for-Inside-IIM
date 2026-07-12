import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

const TICKER_ITEMS = [
  { ticker: "AAPL", move: "+1.8%", up: true },
  { ticker: "TSLA", move: "-2.3%", up: false },
  { ticker: "MSFT", move: "+0.6%", up: true },
  { ticker: "GOOGL", move: "+1.1%", up: true },
  { ticker: "AMZN", move: "-0.4%", up: false },
  { ticker: "NVDA", move: "+3.2%", up: true },
  { ticker: "META", move: "+0.9%", up: true },
  { ticker: "NFLX", move: "-1.2%", up: false },
];

const PIPELINE = [
  "Company Research",
  "Financial Analysis",
  "News Analysis",
  "Risk Assessment",
  "Investment Decision",
];

export default function LandingPage() {
  const doubledTicker = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="container landing-nav-inner">
          <Link to="/" className="landing-brand">
            <span className="sidebar-brand-mark">◆</span> Analyst
          </Link>
          <div className="landing-nav-links">
            <Link to="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary">
              Start Research
            </Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container hero-inner">
          <span className="eyebrow mono">AI Investment Research Desk</span>
          <h1>
            Six agents.
            <br />
            One verdict.
          </h1>
          <p className="hero-sub">
            Type a company name. A supervised chain of research, financial, news, risk, and decision agents
            reads the real numbers and hands you a BUY, HOLD, or PASS — with its reasoning shown in full.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Analyze a company
            </Link>
            <Link to="/login" className="btn btn-ghost">
              I have an account
            </Link>
          </div>
        </div>
      </header>

      <div className="ticker-tape" aria-hidden="true">
        <div className="ticker-track">
          {doubledTicker.map((item, idx) => (
            <span className="ticker-item mono" key={idx}>
              {item.ticker}
              <span className={item.up ? "ticker-up" : "ticker-down"}>{item.move}</span>
            </span>
          ))}
        </div>
      </div>

      <section className="section container">
        <span className="eyebrow mono">The pipeline</span>
        <h2>Every report follows the same chain of custody.</h2>
        <div className="pipeline-strip">
          {PIPELINE.map((label, idx) => (
            <React.Fragment key={label}>
              <div className="pipeline-node">
                <span className="pipeline-index mono">{String(idx + 1).padStart(2, "0")}</span>
                <span className="pipeline-label">{label}</span>
              </div>
              {idx < PIPELINE.length - 1 && <span className="pipeline-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="section container features-grid">
        <div className="feature-card">
          <h3>Grounded in real data</h3>
          <p>Live financials from Yahoo Finance and recent headlines from GNews — never fabricated numbers.</p>
        </div>
        <div className="feature-card">
          <h3>Full reasoning, not a black box</h3>
          <p>Every recommendation ships with the AI's step-by-step reasoning and a transparent confidence score.</p>
        </div>
        <div className="feature-card">
          <h3>Your research, saved</h3>
          <p>Every run is saved to your private history — revisit any report whenever you need it.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <span className="mono">Analyst — AI Investment Research Agent</span>
        </div>
      </footer>
    </div>
  );
}
