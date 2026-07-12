import bcrypt from "bcryptjs";
import { prisma } from "../database/prismaClient.js";
import { signToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

const SALT_ROUNDS = 10;

export async function registerUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const token = signToken({ userId: user.id });
  return { user, token };
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = signToken({ userId: user.id });
  const { password: _password, ...safeUser } = user;
  return { user: safeUser, token };
}

export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { researches: true } },
    },
  });
  if (!user) throw new ApiError(404, "User not found.");
  return user;
}

export default { registerUser, loginUser, getUserProfile };
