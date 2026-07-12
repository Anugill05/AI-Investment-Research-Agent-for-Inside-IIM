import { Annotation } from "@langchain/langgraph";

/**
 * Shared state passed between every node of the multi-agent research graph.
 * Each node reads what it needs and writes its own slice back into state.
 */
export const ResearchStateAnnotation = Annotation.Root({
  // Input
  companyName: Annotation(),
  userId: Annotation(),
  researchId: Annotation(),

  // Progress timeline - array of { step, status, timestamp }
  progress: Annotation({
    reducer: (current = [], update = []) => [...current, ...update],
    default: () => [],
  }),

  // Company Research Agent output
  ticker: Annotation(),
  companyProfile: Annotation(),
  companyOverview: Annotation(),

  // Financial Analysis Agent output
  financialData: Annotation(),
  financialHealth: Annotation(),
  revenueAnalysis: Annotation(),
  profitabilityAnalysis: Annotation(),
  valuationSummary: Annotation(),

  // News Analysis Agent output
  newsData: Annotation(),
  newsSummary: Annotation(),
  fearGreedData: Annotation(),
  marketSentiment: Annotation(),

  // Risk Assessment Agent output
  riskAnalysis: Annotation(),
  opportunities: Annotation(),

  // Investment Decision Agent output
  finalRecommendation: Annotation(),
  recommendation: Annotation(),
  confidenceScore: Annotation(),
  aiReasoning: Annotation(),

  // Persistence Agent output
  reportId: Annotation(),

  // Error handling
  errors: Annotation({
    reducer: (current = [], update = []) => [...current, ...update],
    default: () => [],
  }),
  status: Annotation(),
});

export default ResearchStateAnnotation;
