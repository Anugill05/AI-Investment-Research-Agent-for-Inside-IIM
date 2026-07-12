import { axiosClient } from "./axiosClient.js";

export const createResearchRequest = (companyName) =>
  axiosClient.post("/research", { companyName }).then((r) => r.data);

export const getHistoryRequest = () => axiosClient.get("/history").then((r) => r.data);
export const getHistoryDetailRequest = (id) => axiosClient.get(`/history/${id}`).then((r) => r.data);
export const deleteHistoryRequest = (id) => axiosClient.delete(`/history/${id}`).then((r) => r.data);

export default {
  createResearchRequest,
  getHistoryRequest,
  getHistoryDetailRequest,
  deleteHistoryRequest,
};
