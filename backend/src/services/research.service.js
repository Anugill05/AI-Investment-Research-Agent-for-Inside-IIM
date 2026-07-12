import { prisma } from "../database/prismaClient.js";
import { researchGraph } from "../langgraph/graph.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../config/logger.js";

export async function runResearch({ companyName, userId }) {
  const research = await prisma.research.create({
    data: { companyName, userId, status: "PENDING" },
  });

  try {
    const finalState = await researchGraph.invoke({
      companyName,
      userId,
      researchId: research.id,
    });

    if (finalState.status === "FAILED") {
      await prisma.research.update({
        where: { id: research.id },
        data: { status: "FAILED", errorMessage: finalState.errors?.join("; ") || "Unknown error" },
      });
    }

    return {
      researchId: research.id,
      status: finalState.status,
      ticker: finalState.ticker || null,
      progress: finalState.progress || [],
      errors: finalState.errors || [],
      report:
        finalState.status === "COMPLETED"
          ? {
              companyOverview: finalState.companyOverview,
              financialHealth: finalState.financialHealth,
              revenueAnalysis: finalState.revenueAnalysis,
              profitabilityAnalysis: finalState.profitabilityAnalysis,
              valuationSummary: finalState.valuationSummary,
              newsSummary: finalState.newsSummary,
              marketSentiment: finalState.marketSentiment,
              riskAnalysis: finalState.riskAnalysis,
              opportunities: finalState.opportunities,
              finalRecommendation: finalState.finalRecommendation,
              recommendation: finalState.recommendation,
              confidenceScore: finalState.confidenceScore,
              aiReasoning: finalState.aiReasoning,
            }
          : null,
    };
  } catch (err) {
    logger.error(`runResearch fatal error: ${err.message}`);
    await prisma.research.update({
      where: { id: research.id },
      data: { status: "FAILED", errorMessage: err.message },
    });
    throw new ApiError(500, `Research pipeline failed: ${err.message}`);
  }
}

export default { runResearch };
