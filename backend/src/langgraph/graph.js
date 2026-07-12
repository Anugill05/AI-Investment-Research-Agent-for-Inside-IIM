import { StateGraph, END } from "@langchain/langgraph";
import { ResearchStateAnnotation } from "./state/researchState.js";
import { supervisorNode } from "./nodes/supervisorNode.js";
import { companyResearchNode } from "./nodes/companyResearchNode.js";
import { financialAnalysisNode } from "./nodes/financialAnalysisNode.js";
import { newsAnalysisNode } from "./nodes/newsAnalysisNode.js";
import { riskAssessmentNode } from "./nodes/riskAssessmentNode.js";
import { investmentDecisionNode } from "./nodes/investmentDecisionNode.js";
import { persistenceNode } from "./nodes/persistenceNode.js";
import { logger } from "../config/logger.js";

/**
 * Wraps a node function so that any uncaught exception is captured into
 * shared state as an error and the pipeline is marked FAILED instead of
 * crashing the whole process.
 */
function withErrorBoundary(nodeFn, nodeName) {
  return async (state) => {
    try {
      return await nodeFn(state);
    } catch (err) {
      logger.error(`[${nodeName}] uncaught error: ${err.message}`);
      return {
        errors: [`${nodeName} threw: ${err.message}`],
        status: "FAILED",
        progress: [{ step: nodeName, status: "failed", timestamp: new Date().toISOString() }],
      };
    }
  };
}

/**
 * Conditional edge: if a node marked the pipeline FAILED, short-circuit
 * straight to the persistence node so partial progress / error state is
 * still recorded, rather than continuing to burn LLM calls on bad data.
 */
function routeAfter(nodeIfOk) {
  return (state) => (state.status === "FAILED" ? "persistence" : nodeIfOk);
}

export function buildResearchGraph() {
  const graph = new StateGraph(ResearchStateAnnotation)
    .addNode("supervisor", withErrorBoundary(supervisorNode, "Supervisor Agent"))
    .addNode("companyResearch", withErrorBoundary(companyResearchNode, "Company Research Agent"))
    .addNode("financialAnalysis", withErrorBoundary(financialAnalysisNode, "Financial Analysis Agent"))
    .addNode("newsAnalysis", withErrorBoundary(newsAnalysisNode, "News Analysis Agent"))
    .addNode("riskAssessment", withErrorBoundary(riskAssessmentNode, "Risk Assessment Agent"))
    .addNode("investmentDecision", withErrorBoundary(investmentDecisionNode, "Investment Decision Agent"))
    .addNode("persistence", withErrorBoundary(persistenceNode, "Persistence Agent"))

    .addEdge("__start__", "supervisor")
    .addConditionalEdges("supervisor", routeAfter("companyResearch"), {
      companyResearch: "companyResearch",
      persistence: "persistence",
    })
    .addConditionalEdges("companyResearch", routeAfter("financialAnalysis"), {
      financialAnalysis: "financialAnalysis",
      persistence: "persistence",
    })
    .addConditionalEdges("financialAnalysis", routeAfter("newsAnalysis"), {
      newsAnalysis: "newsAnalysis",
      persistence: "persistence",
    })
    .addConditionalEdges("newsAnalysis", routeAfter("riskAssessment"), {
      riskAssessment: "riskAssessment",
      persistence: "persistence",
    })
    .addConditionalEdges("riskAssessment", routeAfter("investmentDecision"), {
      investmentDecision: "investmentDecision",
      persistence: "persistence",
    })
    .addEdge("investmentDecision", "persistence")
    .addEdge("persistence", END);

  return graph.compile();
}

export const researchGraph = buildResearchGraph();

export default researchGraph;
