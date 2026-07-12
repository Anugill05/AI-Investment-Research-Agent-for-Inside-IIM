import { logger } from "../../config/logger.js";

/**
 * Supervisor Agent - entry point of the graph.
 * Initializes the shared state and kicks off the pipeline.
 */
export async function supervisorNode(state) {
  logger.info(`[Supervisor] Starting research pipeline for "${state.companyName}"`);
  return {
    status: "RUNNING",
    progress: [{ step: "Research Started", status: "done", timestamp: new Date().toISOString() }],
  };
}

export default supervisorNode;
