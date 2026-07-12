import { axiosClient } from "./axiosClient.js";

export const registerRequest = (payload) => axiosClient.post("/auth/register", payload).then((r) => r.data);
export const loginRequest = (payload) => axiosClient.post("/auth/login", payload).then((r) => r.data);
export const logoutRequest = () => axiosClient.post("/auth/logout").then((r) => r.data);
export const profileRequest = () => axiosClient.get("/auth/profile").then((r) => r.data);

export default { registerRequest, loginRequest, logoutRequest, profileRequest };
