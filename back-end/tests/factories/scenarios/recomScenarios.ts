import { Recommendation as IRecommendationData } from "@prisma/client";
import { prisma } from "../../../src/database.js";
import {
  recommendationFac,
  recommendationFacWithScore,
} from "../createRecomFacs/rightRecomFactory.js";

export type TRecomBody = Omit<IRecommendationData, "id" | "score">;
export type TRecomAmount = Omit<IRecommendationData, "id">;

export async function insertRecom(): Promise<IRecommendationData> {
  return await prisma.recommendation.create({
    data: await recommendationFac(),
  });
}

export async function recomToWillBeDeleted(): Promise<IRecommendationData> {
  const body: TRecomBody = await recommendationFac();
  return await prisma.recommendation.create({
    data: { ...body, score: -5 },
  });
}

export async function createManyRecoms() {
  const recoms = [];
  while (recoms.length < 12) {
    const recom: TRecomBody = await recommendationFac();
    const repeatedName = recoms.find((element) => element.name === recom.name);
    if (!repeatedName) recoms.push(recom);
  }
  return await prisma.recommendation.createMany({ data: recoms });
}

export async function createRecomsWithScores() {
  const recoms = [];
  while (recoms.length < 10) {
    const recom: TRecomAmount = await recommendationFacWithScore();
    const repeatedName = recoms.find((element) => element.name === recom.name);
    if (!repeatedName) recoms.push(recom);
  }

  return await prisma.recommendation.createMany({ data: recoms });
}
