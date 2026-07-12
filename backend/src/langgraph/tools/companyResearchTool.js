import { tool } from "@langchain/core/tools";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";
import { logger } from "../../config/logger.js";
import { withRetry } from "../../utils/retry.js";

// yahoo-finance2 v3+ ships its API as a class - the default export must be
// instantiated before use (`new YahooFinance()`), it is no longer a
// ready-to-use singleton. A single shared instance is fine to reuse across
// requests.
const yahooFinance = new YahooFinance();

// yahoo-finance2 validates every response against its own bundled zod
// schemas. Yahoo's actual API drifts from those schemas often enough that
// validation throws on perfectly usable data. We disable strict validation
// (per-call) and rely on optional chaining below instead.
const NO_VALIDATION = { validateResult: false };

async function resolveTicker(companyName) {
  const results = await withRetry(
    () => yahooFinance.search(companyName, {}, NO_VALIDATION),
    { label: `yahoo-finance search(${companyName})` }
  );

  const equityMatch = results.quotes?.find((q) => q.quoteType === "EQUITY" && q.symbol);
  if (!equityMatch) {
    throw new Error(`Could not resolve a ticker symbol for "${companyName}".`);
  }
  return equityMatch.symbol;
}

export const companyResearchTool = tool(
  async ({ companyName }) => {
    try {
      const ticker = await resolveTicker(companyName);

      const quoteSummary = await withRetry(
        () =>
          yahooFinance.quoteSummary(
            ticker,
            { modules: ["assetProfile", "summaryProfile", "price", "summaryDetail"] },
            NO_VALIDATION
          ),
        { label: `yahoo-finance quoteSummary(${ticker})` }
      );

      const profile = {
        ticker,
        longName: quoteSummary.price?.longName || companyName,
        sector: quoteSummary.assetProfile?.sector || null,
        industry: quoteSummary.assetProfile?.industry || null,
        website: quoteSummary.assetProfile?.website || null,
        fullTimeEmployees: quoteSummary.assetProfile?.fullTimeEmployees || null,
        businessSummary: quoteSummary.assetProfile?.longBusinessSummary || null,
        currency: quoteSummary.price?.currency || null,
        exchange: quoteSummary.price?.exchangeName || null,
        currentPrice: quoteSummary.price?.regularMarketPrice || null,
        marketCap: quoteSummary.summaryDetail?.marketCap || null,
      };

      return JSON.stringify({ success: true, data: profile });
    } catch (err) {
      // Log the full stack, not just the message, so real root causes
      // (network, schema, auth) are visible in server logs.
      logger.error(`companyResearchTool error: ${err.stack || err.message}`);
      return JSON.stringify({
        success: false,
        error: err.message,
        data: null,
      });
    }
  },
  {
    name: "company_research_tool",
    description:
      "Resolves a company name to its stock ticker and fetches its business profile (sector, industry, summary, employees, market cap) from Yahoo Finance.",
    schema: z.object({
      companyName: z.string().describe("The company name to research, e.g. 'Apple' or 'Tesla'"),
    }),
  }
);

export default companyResearchTool;
