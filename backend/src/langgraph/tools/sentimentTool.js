import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import { withRetry } from "../../utils/retry.js";

/**
 * Fetches the CNN-style Fear & Greed Index via the free alternative.me API
 * (a widely used free proxy for crypto/market-wide sentiment).
 */
export const sentimentTool = tool(
  async () => {
    try {
      const response = await withRetry(
        () => axios.get(env.FEAR_GREED_API_URL, { params: { limit: 1 }, timeout: 10000 }),
        { label: "Fear & Greed Index fetch" }
      );

      const entry = response.data?.data?.[0];
      const fearGreed = entry
        ? {
            value: Number(entry.value),
            classification: entry.value_classification,
            timestamp: entry.timestamp,
            fallback: false,
          }
        : { value: null, classification: "Unavailable", fallback: true };

      return JSON.stringify({ success: true, data: fearGreed });
    } catch (err) {
      logger.error(`sentimentTool error: ${err.message}`);
      return JSON.stringify({
        success: true,
        data: { value: null, classification: "Unavailable", fallback: true, reason: err.message },
      });
    }
  },
  {
    name: "sentiment_tool",
    description:
      "Fetches the current market Fear & Greed Index from the free alternative.me API to gauge overall market sentiment.",
    schema: z.object({}),
  }
);

export default sentimentTool;
