import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { runResearch } from "../services/research.service.js";

export const createResearch = asyncHandler(async (req, res) => {
  const { companyName } = req.body;
  const result = await runResearch({ companyName, userId: req.user.id });

  // Always respond 2xx here: the HTTP request to run research succeeded.
  // Whether the pipeline itself landed on COMPLETED or FAILED is a business
  // outcome carried in result.status / result.errors, not an HTTP error -
  // returning 4xx/5xx would make axios throw and the frontend would only see
  // this generic message, losing the real error from result.errors.
  const message =
    result.status === "COMPLETED"
      ? "Research completed successfully."
      : "Research pipeline encountered an issue. Partial progress has been saved.";

  res.status(201).json(new ApiResponse(201, result, message));
});

export default { createResearch };
