import { companyResearchTool } from "../tools/companyResearchTool.js";
import { getLLM } from "../llm.js";
import { companyOverviewPrompt } from "../prompts/prompts.js";
import { logger } from "../../config/logger.js";

export async function companyResearchNode(state) {
  logger.info(`[CompanyResearchAgent] Fetching profile for "${state.companyName}"`);

  const raw = await companyResearchTool.invoke({ companyName: state.companyName });
  const parsed = JSON.parse(raw);

  if (!parsed.success || !parsed.data) {
    return {
      errors: [`Company Research Agent failed: ${parsed.error || "Unknown error"}`],
      status: "FAILED",
      progress: [
        { step: "Fetching Company Information", status: "failed", timestamp: new Date().toISOString() },
      ],
    };
  }

  const profile = parsed.data;
  const llm = getLLM({ temperature: 0.2 });
  const chain = companyOverviewPrompt.pipe(llm);
  const response = await chain.invoke({ profileData: JSON.stringify(profile) });

  return {
    ticker: profile.ticker,
    companyProfile: profile,
    companyOverview: response.content,
    progress: [
      { step: "Fetching Company Information", status: "done", timestamp: new Date().toISOString() },
    ],
  };
}

export default companyResearchNode;
