import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { env } from "../config/env.js";
import { registerUser, loginUser, getUserProfile } from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);
  res.cookie("token", token, cookieOptions);
  res.status(201).json(new ApiResponse(201, { user, token }, "Account created successfully."));
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);
  res.cookie("token", token, cookieOptions);
  res.status(200).json(new ApiResponse(200, { user, token }, "Logged in successfully."));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully."));
});

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await getUserProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, profile, "Profile fetched successfully."));
});

export default { register, login, logout, getProfile };
