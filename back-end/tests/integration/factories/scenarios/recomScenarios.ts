import { prisma } from "../../../../src/database";
import recommendationFac from "../createRecomFacs/rightRecomFactory";

export async function recomToVote() {
  return await prisma.recommendation.create({
    data: await recommendationFac(),
  });
}

export async function recomToWillBeDeleted() {
  const body = await recommendationFac();
  return await prisma.recommendation.create({
    data: { ...body, score: -5 },
  });
}
