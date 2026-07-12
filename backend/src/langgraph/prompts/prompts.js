import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Each prompt is now a ChatPromptTemplate instead of a raw string with
// manual {placeholder} replacement. LangChain fills in the variables (via
// .invoke({ profileData: ... }) at the call site) and produces a proper
// message object the chat model expects - see
// https://reference.langchain.com/javascript/langchain-core/prompts/ChatPromptTemplate

export const companyOverviewPrompt = ChatPromptTemplate.fromTemplate(
  `You are a senior equity research analyst. Using the structured company profile data below (from Yahoo Finance), write a concise, factual "Company Overview" section for an investment research report.

Rules:
- Only use facts present in the data. Never invent numbers, dates, or facts.
- 3-5 sentences, professional tone, no headings.
- Mention sector, industry, business summary highlights, and headcount if available.

Company Profile Data:
{profileData}`
);

// Structured-output schema for the financial analysis step. Passed to
// model.withStructuredOutput() instead of asking the model for JSON in the
// prompt text and parsing it by hand afterwards.
export const financialAnalysisSchema = z.object({
  financialHealth: z.string().describe("Balance sheet strength, cash position, debt levels (2-4 sentences)"),
  revenueAnalysis: z.string().describe("Revenue trends, growth rate if derivable (2-4 sentences)"),
  profitabilityAnalysis: z.string().describe("Margins, profitability trend (2-4 sentences)"),
  valuationSummary: z.string().describe("Valuation multiples (P/E, P/B, EV/EBITDA) versus what they typically imply (2-4 sentences)"),
});

export const financialAnalysisPrompt = ChatPromptTemplate.fromTemplate(
  `You are a financial analyst. Using the structured financial data below (from Yahoo Finance), analyze the company's financial health, revenue, profitability, and valuation.

Rules:
- Only use facts present in the data. Never invent numbers.
- If a metric is missing, state that it is not available rather than guessing.

Financial Data:
{financialData}`
);

export const newsSummaryPrompt = ChatPromptTemplate.fromTemplate(
  `You are a market news analyst. Using the recent news headlines and descriptions below, write a "Latest News Summary" (3-5 sentences) capturing the key themes and events affecting the company. Stay factual and neutral. Do not fabricate events not present in the articles.

News Articles:
{newsData}`
);

export const sentimentPrompt = ChatPromptTemplate.fromTemplate(
  `You are a market sentiment analyst. Using the news articles and the Fear & Greed Index value below, assess overall "Market Sentiment" toward this company/market (3-4 sentences). Classify sentiment as Bullish, Neutral, or Bearish and justify briefly using the data provided.

Fear & Greed Index: {fearGreedData}

News Articles:
{newsData}`
);

export const riskOpportunitySchema = z.object({
  riskAnalysis: z.string().describe("Key risks (market, financial, competitive, regulatory) grounded in the data (3-5 sentences)"),
  opportunities: z.string().describe("Key growth opportunities grounded in the data (3-5 sentences)"),
});

export const riskOpportunityPrompt = ChatPromptTemplate.fromTemplate(
  `You are a risk analyst. Using all the research data gathered so far (company profile, financials, news, sentiment), assess the key risks and opportunities.

Research Data:
{researchData}`
);

// Enforcing the recommendation as an enum and the confidence score as a
// bounded number means Gemini is constrained to valid values by the schema
// itself, rather than your code trusting whatever free-text JSON came back.
export const investmentDecisionSchema = z.object({
  finalRecommendation: z.string().describe("One paragraph summarizing the overall investment thesis"),
  recommendation: z.enum(["BUY", "HOLD", "PASS"]),
  confidenceScore: z.number().int().min(0).max(100),
  aiReasoning: z
    .string()
    .describe("Step-by-step reasoning explaining how financials, news, sentiment, and risk were weighed (4-8 sentences)"),
});

export const investmentDecisionPrompt = ChatPromptTemplate.fromTemplate(
  `You are the Chief Investment Strategist. Using the complete research dossier below, produce a final investment decision.

Rules:
- Be decisive but grounded strictly in the provided data.
- confidenceScore should reflect how much supporting evidence exists, not just conviction.

Research Dossier:
{researchData}`
);

export default {
  companyOverviewPrompt,
  financialAnalysisPrompt,
  financialAnalysisSchema,
  newsSummaryPrompt,
  sentimentPrompt,
  riskOpportunityPrompt,
  riskOpportunitySchema,
  investmentDecisionPrompt,
  investmentDecisionSchema,
};
