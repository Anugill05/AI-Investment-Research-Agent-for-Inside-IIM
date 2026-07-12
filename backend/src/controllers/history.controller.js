import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { listHistory, getHistoryItem, deleteHistoryItem } from "../services/history.service.js";

export const getHistory = asyncHandler(async (req, res) => {
  const items = await listHistory(req.user.id);
  res.status(200).json(new ApiResponse(200, items, "History fetched successfully."));
});

export const getHistoryDetail = asyncHandler(async (req, res) => {
  const item = await getHistoryItem(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, item, "Report fetched successfully."));
});

export const removeHistoryItem = asyncHandler(async (req, res) => {
  const result = await deleteHistoryItem(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, result, "Report deleted successfully."));
});

export default { getHistory, getHistoryDetail, removeHistoryItem };
