import { prisma } from "../../src/database";
import supertest from "supertest";
import app from "../../src/app";
import recommendationFac from "./factories/createRecomFacs/rightRecomFactory";
import wrongDomainRecomFac from "./factories/createRecomFacs/wrongRecomFactorie";
import { recomToVote, recomToWillBeDeleted } from "./factories/scenarios/recomScenarios";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY CASCADE;`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("tests for POST /recommendations", () => {
  it("try to insert a new recommendation with a right body and received status 201", async () => {
    const newRecom = await recommendationFac();

    const { status } = await supertest(app)
      .post("/recommendations")
      .send(newRecom);
    const recomInDB = await prisma.recommendation.findUnique({
      where: { name: newRecom.name },
    });

    expect(status).toBe(201);
    expect(recomInDB).not.toBeFalsy();
  });

  it("try to insert a new recommendation with a wrong body (domain isn't a 'youtube' or 'youtu' link) and received status 422", async () => {
    const newRecom = await wrongDomainRecomFac();

    const result = await supertest(app).post("/recommendations").send(newRecom);

    expect(result.status).toBe(422);
  });

  it("try to insert a new recommendation with a name who already exists in DB and received status 409", async () => {
    const recom = await recommendationFac();

    await prisma.recommendation.create({ data: recom });
    const { status } = await supertest(app)
      .post("/recommendations")
      .send(recom);

    expect(status).toBe(409);
  });
});

describe("tests for POST /recommendations/:id/upvote", () => {
  it("upvote a existing recommendation and received status 200", async () => {
    const { id, score } = await recomToVote();

    const { status } = await supertest(app).post(
      `/recommendations/${id}/upvote`
    );
    const { score: scoreUpvoted } = await prisma.recommendation.findUnique({
      where: { id },
    });

    const upvoteHappened: boolean = scoreUpvoted > score;

    expect(status).toBe(200);
    expect(upvoteHappened).not.toBeFalsy();
  });

  it("try to upvote a recommendation with a invalid id and received status 404", async () => {
    const { id: lastRecomId } = await recomToVote(); //insert a new recommendation to get a last recommendation_id in DB

    const invalidId = lastRecomId + 1;

    const { status } = await supertest(app).post(
      `/recommendations/${invalidId}/upvote`
    );

    expect(status).toBe(404);
  });
});

describe("tests for POST /recommendations/:id/downvote", () => {
  it("Downvote a existing recommendation and received status 200", async () => {
    const { id, score } = await recomToVote();

    const { status } = await supertest(app).post(
      `/recommendations/${id}/downvote`
    );
    const { score: scoreDownVoted } = await prisma.recommendation.findUnique({
      where: { id },
    });

    const upvoteHappened: boolean = scoreDownVoted < score;

    expect(status).toBe(200);
    expect(upvoteHappened).not.toBeFalsy();
  });

  it("try to downvote a recommendation with a invalid id and received status 404", async () => {
    const { id: lastRecomId } = await recomToVote(); //insert a new recommendation to get a last recommendation_id in DB

    const invalidId = lastRecomId + 1;

    const { status } = await supertest(app).post(
      `/recommendations/${invalidId}/downvote`
    );

    expect(status).toBe(404);
  });

  it("let a recommendation with a score < -5, checks if then it will be deleted and received status 200", async() => {
    const { id, name } = await recomToWillBeDeleted();

    const { status } = await supertest(app).post(`/recommendations/${id}/downvote`);
    const recom = await prisma.recommendation.findUnique({where: {name}});

    expect(status).toBe(200);
    expect(recom).toBeFalsy();
  })
});
