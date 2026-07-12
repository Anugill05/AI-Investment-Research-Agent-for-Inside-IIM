import { getLLM } from "../llm.js";
import { investmentDecisionPrompt, investmentDecisionSchema } from "../prompts/prompts.js";
import { logger } from "../../config/logger.js";

export async function investmentDecisionNode(state) {
  logger.info(`[InvestmentDecisionAgent] Deciding recommendation for "${state.companyName}"`);

  const researchData = {
    companyOverview: state.companyOverview,
    financialHealth: state.financialHealth,
    revenueAnalysis: state.revenueAnalysis,
    profitabilityAnalysis: state.profitabilityAnalysis,
    valuationSummary: state.valuationSummary,
    newsSummary: state.newsSummary,
    marketSentiment: state.marketSentiment,
    riskAnalysis: state.riskAnalysis,
    opportunities: state.opportunities,
  };

  const llm = getLLM({ temperature: 0.25 });
  // The schema's z.enum(["BUY","HOLD","PASS"]) and bounded confidenceScore
  // constrain Gemini's output directly, instead of trusting free-text JSON
  // to happen to contain a valid value.
  const chain = investmentDecisionPrompt.pipe(llm.withStructuredOutput(investmentDecisionSchema));
  const decision = await chain.invoke({ researchData: JSON.stringify(researchData) });

  return {
    finalRecommendation: decision.finalRecommendation,
    recommendation: decision.recommendation,
    confidenceScore: decision.confidenceScore,
    aiReasoning: decision.aiReasoning,
    progress: [{ step: "AI Investment Analysis", status: "done", timestamp: new Date().toISOString() }],
  };
}

export default investmentDecisionNode;
