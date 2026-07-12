import React from "react";

const PIPELINE_STEPS = [
  "Research Started",
  "Fetching Company Information",
  "Fetching Financial Data",
  "Fetching Latest News",
  "Sentiment Analysis",
  "Risk Assessment",
  "AI Investment Analysis",
  "Saving Report",
  "Completed",
];

/**
 * activeIndex: index of the step currently in-flight (during the simulated
 * reveal animation on the frontend). completedSteps: real steps returned
 * by the backend once the pipeline has actually finished.
 */
export default function ProgressTimeline({ activeIndex, completedSteps = [], failedStep = null }) {
  const doneSet = new Set(completedSteps);

  return (
    <ol className="progress-timeline">
      {PIPELINE_STEPS.map((label, idx) => {
        const isFailed = failedStep === label;
        const isDone = doneSet.has(label) && !isFailed;
        const isActive = idx === activeIndex && !isDone && !isFailed;

        let stateClass = "pending";
        if (isFailed) stateClass = "failed";
        else if (isDone) stateClass = "done";
        else if (isActive) stateClass = "active";

        return (
          <li key={label} className={`timeline-step ${stateClass}`}>
            <span className="timeline-marker">
              {isDone && "✓"}
              {isFailed && "✕"}
              {isActive && <span className="timeline-spinner" />}
              {!isDone && !isFailed && !isActive && idx + 1}
            </span>
            <span className="timeline-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export { PIPELINE_STEPS };
