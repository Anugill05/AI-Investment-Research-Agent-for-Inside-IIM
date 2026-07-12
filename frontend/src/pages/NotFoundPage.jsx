import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <span className="mono eyebrow">404</span>
      <h1>This page didn't make the cut.</h1>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
