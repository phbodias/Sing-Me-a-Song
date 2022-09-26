import { faker } from "@faker-js/faker";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import {
  fakeRecommendationFac,
  manyFakeRecomFac,
} from "../factories/fakeRecomFacs/fakeRecomFac";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("tests for 'insert", () => {
  it("insert a new recommendation when name isn't in DB yet", async () => {
    const recommendation = await fakeRecommendationFac();
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(recommendation);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it("try to insert a new recommendation when name already in DB", async () => {
    const recommendation = await fakeRecommendationFac();
    const expectedError = {
      type: "conflict",
      message: "Recommendations names must be unique",
    };
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => recommendation);
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.insert(recommendation);

    await expect(result).rejects.toEqual(expectedError);
    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe("tests for 'upvote'", () => {
  it("upvote a recommendation", async () => {
    const recommendation = await fakeRecommendationFac();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => ({ recommendation }));
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => ({
        ...recommendation,
        score: recommendation.score + 1,
      }));

    const result = await recommendationService.upvote(recommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("return error when id is not found", async () => {
    const recomendation = await fakeRecommendationFac();
    const expectedError = { type: "not_found", message: "" };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.upvote(recomendation.id);

    await expect(result).rejects.toEqual(expectedError);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });
});

describe("tests for 'downvote'", () => {
  it("downvote a recommendation", async () => {
    const recommendation = await fakeRecommendationFac();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => ({ recommendation }));
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => ({
        ...recommendation,
        score: recommendation.score - 1,
      }));

    const result = await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("return error when id is not found", async () => {
    const recomendation = await fakeRecommendationFac();
    const expectedError = { type: "not_found", message: "" };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.downvote(recomendation.id + 1);

    await expect(result).rejects.toEqual(expectedError);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });

  it("Modify and delete recomendation when score becomes lower than -5", async () => {
    const recommendation = await fakeRecommendationFac();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => ({ ...recommendation, score: -5 }));
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => ({ ...recommendation, score: -6 }));
    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("tests for 'getByIdOrFail'", () => {
  it("find a recommendation when id is valid", async () => {
    const recommendation = await fakeRecommendationFac();
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => recommendation);

    const result = await recommendationService.getById(recommendation.id);

    expect(result.name).not.toBeFalsy();
    expect(recommendationRepository.find).toBeCalled();
  });

  it("return error when id is not found", async () => {
    const recommendation = await fakeRecommendationFac();
    const expectedError = { type: "not_found", message: "" };
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.getById(recommendation.id + 1);

    await expect(result).rejects.toEqual(expectedError);
    expect(recommendationRepository.find).toBeCalled();
  });
});

describe("tests for 'get'", () => {
  it("get all recommendations", async () => {
    const recoms = await manyFakeRecomFac();
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => recoms);

    const result = await recommendationService.get();

    expect(result.length).toEqual(recoms.length);
    expect(recommendationRepository.findAll).toBeCalled();
  });
});

describe("tests for 'getTop'", () => {
  it("get x top ( where x = amount) recommendations, ordered by score", async () => {
    const amount = faker.datatype.number({ min: 1, max: 10 });
    const recoms = (await manyFakeRecomFac()).slice(0, amount);

    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((amount): any => recoms); //as the sorting is done directly in DB, and we are testing the service only, no need to test this here

    const result = await recommendationService.getTop(amount);

    expect(result.length).toEqual(recoms.length);
    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });
});

describe("tests for 'getRandom'", () => {
  it("return a random recommendation", async () => {
    const recomendations = await manyFakeRecomFac();

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => recomendations);

    const result = await recommendationService.getRandom();
    let control: boolean = false;
    for (let i = 0; i < 10; i++) {
      if (result.name === recomendations[i].name) control = true;
    }

    expect(control).not.toBeFalsy();
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
  });

  it("return error 404 when no recommendations are found", async () => {
    const expectedError = { type: "not_found", message: "" };
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => []);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => []);

    const result = recommendationService.getRandom();

    await expect(result).rejects.toEqual(expectedError);
    expect(recommendationRepository.findAll).toBeCalledTimes(2);
  });
});
