import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { prisma } from "../../database/prismaClient.js";
import { logger } from "../../config/logger.js";

/**
 * Persists the final research report to PostgreSQL via Prisma.
 * This tool is invoked by the Persistence Agent as the last step of the graph.
 */
export const saveReportTool = tool(
  async (input) => {
    try {
      const report = await prisma.researchReport.create({
        data: {
          researchId: input.researchId,
          companyOverview: input.companyOverview,
          financialHealth: input.financialHealth,
          revenueAnalysis: input.revenueAnalysis,
          profitabilityAnalysis: input.profitabilityAnalysis,
          valuationSummary: input.valuationSummary,
          newsSummary: input.newsSummary,
          marketSentiment: input.marketSentiment,
          riskAnalysis: input.riskAnalysis,
          opportunities: input.opportunities,
          finalRecommendation: input.finalRecommendation,
          aiReasoning: input.aiReasoning,
          rawFinancialData: input.rawFinancialData || {},
          rawNewsData: input.rawNewsData || {},
          sentimentData: input.sentimentData || {},
        },
      });

      await prisma.research.update({
        where: { id: input.researchId },
        data: {
          status: "COMPLETED",
          recommendation: input.recommendation,
          confidenceScore: input.confidenceScore,
        },
      });

      return JSON.stringify({ success: true, data: { reportId: report.id } });
    } catch (err) {
      logger.error(`saveReportTool error: ${err.message}`);
      return JSON.stringify({ success: false, error: err.message });
    }
  },
  {
    name: "save_report_tool",
    description: "Persists the completed investment research report and updates the research status in PostgreSQL.",
    schema: z.object({
      researchId: z.string(),
      companyOverview: z.string(),
      financialHealth: z.string(),
      revenueAnalysis: z.string(),
      profitabilityAnalysis: z.string(),
      valuationSummary: z.string(),
      newsSummary: z.string(),
      marketSentiment: z.string(),
      riskAnalysis: z.string(),
      opportunities: z.string(),
      finalRecommendation: z.string(),
      aiReasoning: z.string(),
      recommendation: z.string(),
      confidenceScore: z.number(),
      rawFinancialData: z.any().optional(),
      rawNewsData: z.any().optional(),
      sentimentData: z.any().optional(),
    }),
  }
);

export default saveReportTool;
