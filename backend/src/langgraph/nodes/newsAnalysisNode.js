import { newsTool } from "../tools/newsTool.js";
import { sentimentTool } from "../tools/sentimentTool.js";
import { getLLM } from "../llm.js";
import { newsSummaryPrompt, sentimentPrompt } from "../prompts/prompts.js";
import { logger } from "../../config/logger.js";

export async function newsAnalysisNode(state) {
  logger.info(`[NewsAnalysisAgent] Fetching news for "${state.companyName}"`);

  const [newsRaw, fearGreedRaw] = await Promise.all([
    newsTool.invoke({ companyName: state.companyName }),
    sentimentTool.invoke({}),
  ]);

  const newsParsed = JSON.parse(newsRaw);
  const fearGreedParsed = JSON.parse(fearGreedRaw);

  const newsData = newsParsed.data;
  const fearGreedData = fearGreedParsed.data;
  const articlesText = newsData.articles.length
    ? JSON.stringify(newsData.articles)
    : "No recent articles were available.";

  const llm = getLLM({ temperature: 0.3 });

  const newsSummaryChain = newsSummaryPrompt.pipe(llm);
  const newsSummaryResponse = await newsSummaryChain.invoke({ newsData: articlesText });

  const sentimentChain = sentimentPrompt.pipe(llm);
  const sentimentResponse = await sentimentChain.invoke({
    fearGreedData: JSON.stringify(fearGreedData),
    newsData: articlesText,
  });

  return {
    newsData,
    fearGreedData,
    newsSummary: newsSummaryResponse.content,
    marketSentiment: sentimentResponse.content,
    progress: [
      { step: "Fetching Latest News", status: "done", timestamp: new Date().toISOString() },
      { step: "Sentiment Analysis", status: "done", timestamp: new Date().toISOString() },
    ],
  };
}

export default newsAnalysisNode;
