import { prisma } from "../database/prismaClient.js";
import { ApiError } from "../utils/ApiError.js";

export async function listHistory(userId) {
  return prisma.research.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      ticker: true,
      status: true,
      recommendation: true,
      confidenceScore: true,
      createdAt: true,
    },
  });
}

export async function getHistoryItem(userId, researchId) {
  const research = await prisma.research.findFirst({
    where: { id: researchId, userId },
    include: { report: true },
  });

  if (!research) {
    throw new ApiError(404, "Research report not found.");
  }

  return research;
}

export async function deleteHistoryItem(userId, researchId) {
  const research = await prisma.research.findFirst({ where: { id: researchId, userId } });
  if (!research) {
    throw new ApiError(404, "Research report not found.");
  }
  await prisma.research.delete({ where: { id: researchId } });
  return { id: researchId };
}

export default { listHistory, getHistoryItem, deleteHistoryItem };
