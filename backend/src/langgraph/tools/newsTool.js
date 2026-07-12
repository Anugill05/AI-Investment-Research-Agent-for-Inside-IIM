import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import { withRetry } from "../../utils/retry.js";

/**
 * Fetches recent news via GNews free API. Falls back to an empty-but-valid
 * structure (never fabricated data) if the API key is missing or the request fails.
 */
export const newsTool = tool(
  async ({ companyName }) => {
    if (!env.GNEWS_API_KEY) {
      logger.warn("GNEWS_API_KEY not set - returning empty news fallback");
      return JSON.stringify({
        success: true,
        data: { articles: [], fallback: true, reason: "GNEWS_API_KEY not configured" },
      });
    }

    try {
      const response = await withRetry(
        () =>
          axios.get("https://gnews.io/api/v4/search", {
            params: {
              q: companyName,
              lang: "en",
              max: 8,
              sortby: "publishedAt",
              apikey: env.GNEWS_API_KEY,
            },
            timeout: 10000,
          }),
        { label: `GNews search(${companyName})` }
      );

      const articles = (response.data?.articles || []).map((a) => ({
        title: a.title,
        description: a.description,
        source: a.source?.name,
        url: a.url,
        publishedAt: a.publishedAt,
      }));

      return JSON.stringify({ success: true, data: { articles, fallback: false } });
    } catch (err) {
      logger.error(`newsTool error: ${err.message}`);
      return JSON.stringify({
        success: true,
        data: { articles: [], fallback: true, reason: err.message },
      });
    }
  },
  {
    name: "news_tool",
    description:
      "Fetches recent news articles about a company using the free GNews API. Returns an empty article list with a fallback flag if unavailable, never fabricated data.",
    schema: z.object({
      companyName: z.string().describe("The company name to search news for"),
    }),
  }
);

export default newsTool;
