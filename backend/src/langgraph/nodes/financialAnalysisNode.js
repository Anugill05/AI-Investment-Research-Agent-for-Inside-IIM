import { financialTool } from "../tools/financialTool.js";
import { getLLM } from "../llm.js";
import { financialAnalysisPrompt, financialAnalysisSchema } from "../prompts/prompts.js";
import { logger } from "../../config/logger.js";

export async function financialAnalysisNode(state) {
  logger.info(`[FinancialAnalysisAgent] Fetching financials for "${state.ticker}"`);

  if (!state.ticker) {
    return {
      errors: ["Financial Analysis Agent skipped: no ticker resolved"],
      status: "FAILED",
      progress: [{ step: "Fetching Financial Data", status: "failed", timestamp: new Date().toISOString() }],
    };
  }

  const raw = await financialTool.invoke({ ticker: state.ticker });
  const parsed = JSON.parse(raw);

  if (!parsed.success || !parsed.data) {
    return {
      errors: [`Financial Analysis Agent failed: ${parsed.error || "Unknown error"}`],
      status: "FAILED",
      progress: [{ step: "Fetching Financial Data", status: "failed", timestamp: new Date().toISOString() }],
    };
  }

  const financialData = parsed.data;
  const llm = getLLM({ temperature: 0.2 });
  // withStructuredOutput constrains Gemini's generation to the given Zod
  // shape and returns the parsed object directly - no manual JSON.parse or
  // markdown-fence stripping needed.
  const chain = financialAnalysisPrompt.pipe(llm.withStructuredOutput(financialAnalysisSchema));
  const analysis = await chain.invoke({ financialData: JSON.stringify(financialData) });

  return {
    financialData,
    financialHealth: analysis.financialHealth,
    revenueAnalysis: analysis.revenueAnalysis,
    profitabilityAnalysis: analysis.profitabilityAnalysis,
    valuationSummary: analysis.valuationSummary,
    progress: [{ step: "Fetching Financial Data", status: "done", timestamp: new Date().toISOString() }],
  };
}

export default financialAnalysisNode;
