import { prisma } from "../../src/database";
import supertest from "supertest";
import app from "../../src/app";
import recommendationFac from "./factories/createRecomFacs/rightRecomFactory";
import {
  wrongDomainRecomFac,
  wrongNameRecomFac,
  allWrongRecomFac,
} from "./factories/createRecomFacs/wrongRecomFactories";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY CASCADE;`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("tests for POST /recommendations", () => {
  it("try to insert a new recommendation with a right body and received status 201", async () => {
    const newRecom = await recommendationFac();

    const result = await supertest(app).post("/recommendations").send(newRecom);
    const recomInDB = await prisma.recommendation.findUnique({
      where: { name: newRecom.name },
    });

    console.log(recomInDB);

    expect(result.status).toBe(201);
    expect(recomInDB).not.toBeFalsy();
  });

  it("try to insert a new recommendation without a name and received status 422", async () => {
    const newRecom = await wrongNameRecomFac();

    const result = await supertest(app).post("/recommendations").send(newRecom);

    expect(result.status).toBe(422);
  });

  it("try to insert a new recommendation with a wrong body (domain isn't a 'youtube' or 'youtu' link) and received status 422", async () => {
    const newRecom = await wrongDomainRecomFac();

    const result = await supertest(app).post("/recommendations").send(newRecom);

    expect(result.status).toBe(422);
  });

  it("try to insert a new recommendation with a wrong body and received status 422", async () => {
    const newRecom = await allWrongRecomFac();

    const result = await supertest(app).post("/recommendations").send(newRecom);

    expect(result.status).toBe(422);
  });
});


