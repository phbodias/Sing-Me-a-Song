import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";
import { Recommendation as IRecommendationData } from "@prisma/client";
import supertest from "supertest";
import app from "../../src/app";
import { recommendationFac } from "./factories/createRecomFacs/rightRecomFactory";
import wrongDomainRecomFac from "./factories/createRecomFacs/wrongRecomFactorie";
import {
  createManyRecoms,
  createRecomsWithScores,
  insertRecom,
  recomToWillBeDeleted,
  TRecomBody,
} from "./factories/scenarios/recomScenarios";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY CASCADE;`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("tests for POST /recommendations", () => {
  it("try to insert a new recommendation with a right body and receives status 201", async () => {
    const newRecom: TRecomBody = await recommendationFac();

    const { status } = await supertest(app)
      .post("/recommendations")
      .send(newRecom);
    const recomInDB: IRecommendationData =
      await prisma.recommendation.findUnique({
        where: { name: newRecom.name },
      });

    expect(status).toBe(201);
    expect(recomInDB).not.toBeFalsy();
  });

  it("try to insert a new recommendation with a wrong body (domain isn't a 'youtube' or 'youtu' link) and receives status 422", async () => {
    const newRecom: TRecomBody = await wrongDomainRecomFac();

    const { status } = await supertest(app)
      .post("/recommendations")
      .send(newRecom);

    expect(status).toBe(422);
  });

  it("try to insert a new recommendation with a name who already exists in DB and receives status 409", async () => {
    const recom: TRecomBody = await recommendationFac();

    await prisma.recommendation.create({ data: recom });
    const { status } = await supertest(app)
      .post("/recommendations")
      .send(recom);

    expect(status).toBe(409);
  });
});

describe("tests for POST /recommendations/:id/upvote", () => {
  it("upvote a existing recommendation and receives status 200", async () => {
    const { id, score } = await insertRecom();

    const { status } = await supertest(app).post(
      `/recommendations/${id}/upvote`
    );
    const { score: scoreUpvoted } = await prisma.recommendation.findUnique({
      where: { id },
    });

    const upvoteHappened: boolean = scoreUpvoted === score + 1;

    expect(status).toBe(200);
    expect(upvoteHappened).not.toBeFalsy();
  });

  it("try to upvote a recommendation with a invalid id and receives status 404", async () => {
    const { id: lastRecomId } = await insertRecom(); //insert a new recommendation to get a last recommendation_id in DB

    const invalidId: Number = lastRecomId + 1;

    const { status } = await supertest(app).post(
      `/recommendations/${invalidId}/upvote`
    );

    expect(status).toBe(404);
  });
});

describe("tests for POST /recommendations/:id/downvote", () => {
  it("Downvote a existing recommendation and receives status 200", async () => {
    const { id, score } = await insertRecom();

    const { status } = await supertest(app).post(
      `/recommendations/${id}/downvote`
    );
    const { score: scoreDownVoted } = await prisma.recommendation.findUnique({
      where: { id },
    });

    const upvoteHappened: boolean = scoreDownVoted === score - 1;

    expect(status).toBe(200);
    expect(upvoteHappened).not.toBeFalsy();
  });

  it("try to downvote a recommendation with a invalid id and receives status 404", async () => {
    const { id: lastRecomId } = await insertRecom(); //insert a new recommendation to get a last recommendation_id in DB

    const invalidId: Number = lastRecomId + 1;

    const { status } = await supertest(app).post(
      `/recommendations/${invalidId}/downvote`
    );

    expect(status).toBe(404);
  });

  it("let a recommendation with a score < -5, checks if then it will be deleted and receives status 200", async () => {
    const { id, name } = await recomToWillBeDeleted();

    const { status } = await supertest(app).post(
      `/recommendations/${id}/downvote`
    );
    const recom: IRecommendationData = await prisma.recommendation.findUnique({
      where: { name },
    });

    expect(status).toBe(200);
    expect(recom).toBeFalsy();
  });
});

describe("tests for GET /recommendations", () => {
  it("get the 10 last recommendations and receives status 200", async () => {
    await createManyRecoms();

    const recommsInDB: IRecommendationData[] = (
      await prisma.recommendation.findMany()
    )
      .slice(2, 12)
      .reverse();

    const { status, body } = await supertest(app).get("/recommendations");

    const verifyBody: boolean =
      body.filter((elem: IRecommendationData, index: any) => {
        return elem.id === recommsInDB[index].id;
      }).length === recommsInDB.length;

    expect(status).toBe(200);
    expect(verifyBody).not.toBeFalsy();
  });
});

describe("tests for GET /recommendations/:id", () => {
  it("get a recommendation by recommendation_id and receives status 200 and the recommendation", async () => {
    const { id, name } = await insertRecom();

    const { status, body } = await supertest(app).get(`/recommendations/${id}`);

    const result: boolean = body.name === name;

    expect(status).toBe(200);
    expect(result).not.toBeFalsy();
  });

  it("insert a invalid recommendation_id and receives status 404", async () => {
    const { id: lastRecomId } = await insertRecom();

    const invalidId: number = lastRecomId + 1;

    const { status } = await supertest(app).get(
      `/recommendations/${invalidId}`
    );

    expect(status).toBe(404);
  });
});

describe("tests for GET /recommendations/random", () => {
  it("get a random recommendation and receives status 200", async () => {
    await createManyRecoms();

    const { status, body } = await supertest(app).get(
      "/recommendations/random"
    );

    expect(status).toBe(200);
    expect(body).not.toBeFalsy();
  });

  it("receives status 404 when no recommendations exist", async () => {
    const result = await supertest(app).get("/recommendations/random");

    expect(result.status).toBe(404);
  });
});

describe("tests for GET /recommendations/top/:amount", () => {
  it("get a x recommendations (where x = amount) and receives status 200", async () => {
    await createRecomsWithScores();

    const amount = faker.datatype.number({ min: 1, max: 10 });

    const { status, body } = await supertest(app).get(
      `/recommendations/top/${amount}`
    );

    const result: boolean =
      body.filter((recom: IRecommendationData, i: any) => {
        if (i < body.length - 1) return recom.score >= body[i + 1].score;
        return recom;
      }).length === body.length;

    expect(status).toBe(200);
    expect(result).not.toBeFalsy();
  });
});
