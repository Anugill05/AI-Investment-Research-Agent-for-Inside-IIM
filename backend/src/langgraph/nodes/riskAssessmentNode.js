import { getLLM } from "../llm.js";
import { riskOpportunityPrompt, riskOpportunitySchema } from "../prompts/prompts.js";
import { logger } from "../../config/logger.js";

export async function riskAssessmentNode(state) {
  logger.info(`[RiskAssessmentAgent] Assessing risk for "${state.companyName}"`);

  const researchData = {
    companyProfile: state.companyProfile,
    financialData: state.financialData,
    newsSummary: state.newsSummary,
    marketSentiment: state.marketSentiment,
  };

  const llm = getLLM({ temperature: 0.3 });
  const chain = riskOpportunityPrompt.pipe(llm.withStructuredOutput(riskOpportunitySchema));
  const analysis = await chain.invoke({ researchData: JSON.stringify(researchData) });

  return {
    riskAnalysis: analysis.riskAnalysis,
    opportunities: analysis.opportunities,
    progress: [{ step: "Risk Assessment", status: "done", timestamp: new Date().toISOString() }],
  };
}

export default riskAssessmentNode;
