import { logger } from "../config/logger.js";

/**
 * Retry an async function with exponential backoff.
 * Used across LangGraph nodes and tools that call external free APIs
 * which may rate-limit or intermittently fail.
 */
export async function withRetry(fn, { retries = 3, baseDelayMs = 500, label = "operation" } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      logger.warn(`[retry] ${label} failed on attempt ${attempt}/${retries}: ${err.message}`);
      if (attempt < retries) {
        const delay = baseDelayMs * 2 ** (attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  logger.error(`[retry] ${label} exhausted all ${retries} attempts`);
  throw lastError;
}

export default withRetry;
