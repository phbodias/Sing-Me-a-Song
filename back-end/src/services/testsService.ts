import {
  createManyRecoms,
  createRecomsWithScores,
} from "../../tests/factories/scenarios/recomScenarios.js";
import * as testsRepository from "../repositories/testsRepository.js";

export async function resetDatabase() {
  await testsRepository.resetDatabase();
}

export async function populateDB() {
  return await createRecomsWithScores();
}
