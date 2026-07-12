import { tool } from "@langchain/core/tools";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";
import { logger } from "../../config/logger.js";
import { withRetry } from "../../utils/retry.js";

// Shared instance - see companyResearchTool.js for why this must be
// constructed with `new` in yahoo-finance2 v3+.
const yahooFinance = new YahooFinance();

// Same rationale as companyResearchTool.js: Yahoo's live schema drifts from
// yahoo-finance2's bundled validation schemas, so we disable validation
// per-call rather than let a schema mismatch throw on good data.
const NO_VALIDATION = { validateResult: false };

export const financialTool = tool(
  async ({ ticker }) => {
    try {
      const summary = await withRetry(
        () =>
          yahooFinance.quoteSummary(
            ticker,
            {
              modules: [
                "financialData",
                "defaultKeyStatistics",
                "summaryDetail",
                "incomeStatementHistory",
                "balanceSheetHistory",
              ],
            },
            NO_VALIDATION
          ),
        { label: `yahoo-finance financials(${ticker})` }
      );

      const financialData = {
        totalRevenue: summary.financialData?.totalRevenue || null,
        revenueGrowth: summary.financialData?.revenueGrowth || null,
        grossMargins: summary.financialData?.grossMargins || null,
        operatingMargins: summary.financialData?.operatingMargins || null,
        profitMargins: summary.financialData?.profitMargins || null,
        ebitda: summary.financialData?.ebitda || null,
        totalCash: summary.financialData?.totalCash || null,
        totalDebt: summary.financialData?.totalDebt || null,
        debtToEquity: summary.financialData?.debtToEquity || null,
        currentRatio: summary.financialData?.currentRatio || null,
        returnOnEquity: summary.financialData?.returnOnEquity || null,
        returnOnAssets: summary.financialData?.returnOnAssets || null,
        trailingPE: summary.summaryDetail?.trailingPE || null,
        forwardPE: summary.summaryDetail?.forwardPE || null,
        priceToBook: summary.defaultKeyStatistics?.priceToBook || null,
        pegRatio: summary.defaultKeyStatistics?.pegRatio || null,
        beta: summary.defaultKeyStatistics?.beta || null,
        fiftyTwoWeekHigh: summary.summaryDetail?.fiftyTwoWeekHigh || null,
        fiftyTwoWeekLow: summary.summaryDetail?.fiftyTwoWeekLow || null,
        dividendYield: summary.summaryDetail?.dividendYield || null,
        recentIncomeStatements:
          summary.incomeStatementHistory?.incomeStatementHistory?.slice(0, 3).map((s) => ({
            endDate: s.endDate,
            totalRevenue: s.totalRevenue,
            netIncome: s.netIncome,
            grossProfit: s.grossProfit,
          })) || [],
        recentBalanceSheets:
          summary.balanceSheetHistory?.balanceSheetStatements?.slice(0, 3).map((s) => ({
            endDate: s.endDate,
            totalAssets: s.totalAssets,
            totalLiab: s.totalLiab,
            totalStockholderEquity: s.totalStockholderEquity,
          })) || [],
      };

      return JSON.stringify({ success: true, data: financialData });
    } catch (err) {
      logger.error(`financialTool error: ${err.stack || err.message}`);
      return JSON.stringify({ success: false, error: err.message, data: null });
    }
  },
  {
    name: "financial_tool",
    description:
      "Fetches detailed financial data (revenue, margins, debt, valuation ratios, income statements, balance sheets) for a stock ticker from Yahoo Finance.",
    schema: z.object({
      ticker: z.string().describe("The stock ticker symbol, e.g. 'AAPL'"),
    }),
  }
);

export default financialTool;
