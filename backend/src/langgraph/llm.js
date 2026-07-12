import { ChatOpenAI } from "@langchain/openai";
import { env } from "../config/env.js";

// timeout and maxRetries are native, documented constructor options on every
// LangChain chat model (see https://docs.langchain.com/oss/javascript/langchain/models).
// LangChain applies them to every call automatically - network errors, 429s,
// and 5xxs are retried with backoff, and a hung request is aborted after
// `timeout` ms.
const DEFAULT_TIMEOUT_MS = 45_000;

export function getLLM({ temperature = 0.3, timeout = DEFAULT_TIMEOUT_MS } = {}) {
  return new ChatOpenAI({
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL,
    temperature,
    maxRetries: 2,
    timeout,
  });
}

export default { getLLM };