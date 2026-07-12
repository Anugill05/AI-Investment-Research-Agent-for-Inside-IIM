import { saveReportTool } from "../tools/saveReportTool.js";
import { prisma } from "../../database/prismaClient.js";
import { logger } from "../../config/logger.js";

export async function persistenceNode(state) {
  logger.info(`[PersistenceAgent] Persisting result for research ${state.researchId}`);

  // CRITICAL: if an earlier agent already failed, do NOT fabricate a report
  // full of "Not available." placeholders and mark it COMPLETED. Record the
  // real failure so the user sees an honest error instead of a fake HOLD/50
  // report.
  if (state.status === "FAILED") {
    const errorMessage = state.errors?.join("; ") || "The research pipeline failed before completion.";
    logger.warn(`[PersistenceAgent] Upstream failure detected, not saving a report: ${errorMessage}`);

    await prisma.research.update({
      where: { id: state.researchId },
      data: { status: "FAILED", errorMessage },
    });

    return {
      status: "FAILED",
      progress: [{ step: "Saving Report", status: "failed", timestamp: new Date().toISOString() }],
    };
  }

  const raw = await saveReportTool.invoke({
    researchId: state.researchId,
    companyOverview: state.companyOverview || "Not available.",
    financialHealth: state.financialHealth || "Not available.",
    revenueAnalysis: state.revenueAnalysis || "Not available.",
    profitabilityAnalysis: state.profitabilityAnalysis || "Not available.",
    valuationSummary: state.valuationSummary || "Not available.",
    newsSummary: state.newsSummary || "Not available.",
    marketSentiment: state.marketSentiment || "Not available.",
    riskAnalysis: state.riskAnalysis || "Not available.",
    opportunities: state.opportunities || "Not available.",
    finalRecommendation: state.finalRecommendation || "Not available.",
    aiReasoning: state.aiReasoning || "Not available.",
    recommendation: state.recommendation || "HOLD",
    confidenceScore: state.confidenceScore ?? 50,
    rawFinancialData: state.financialData || {},
    rawNewsData: state.newsData || {},
    sentimentData: state.fearGreedData || {},
  });

  const parsed = JSON.parse(raw);

  if (!parsed.success) {
    const errorMessage = `Persistence Agent failed: ${parsed.error}`;
    await prisma.research.update({
      where: { id: state.researchId },
      data: { status: "FAILED", errorMessage },
    });

    return {
      errors: [errorMessage],
      status: "FAILED",
      progress: [{ step: "Saving Report", status: "failed", timestamp: new Date().toISOString() }],
    };
  }

  return {
    reportId: parsed.data.reportId,
    status: "COMPLETED",
    progress: [
      { step: "Saving Report", status: "done", timestamp: new Date().toISOString() },
      { step: "Completed", status: "done", timestamp: new Date().toISOString() },
    ],
  };
}

export default persistenceNode;
