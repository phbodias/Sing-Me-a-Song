import { recommendationFac } from "../factories/createRecomFacs/rightRecomFactory.js";

beforeEach(() => {
  cy.request("POST", "http://localhost:5000/resetdb");
});

describe("Tests for adding a new recommendation", () => {
  it("add a new recommendation", () => {
    const recommendation = recommendationFac();

    cy.intercept("GET", "/recommendations").as("getRecommendation");
    cy.visit("http://localhost:3000");
    cy.wait("@getRecommendation");

    cy.get("input[placeholder=Name]")
      .should("be.visible")
      .type(recommendation.name);
    cy.get("input[placeholder='https://youtu.be/...'")
      .should("be.visible")
      .type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get("button").should("be.visible").click();
    cy.wait("@postRecommendation");

    cy.contains(recommendation.name).should("be.visible");
  });

  it("try to add a new recommendation with a name already in DB and ", () => {
    const recommendation = recommendationFac();

    cy.intercept("GET", "/recommendations").as("getRecommendation");
    cy.visit("http://localhost:3000");
    cy.wait("@getRecommendation");

    cy.get("input[placeholder=Name]")
      .should("be.visible")
      .type(recommendation.name);
    cy.get("input[placeholder='https://youtu.be/...'")
      .should("be.visible")
      .type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get("button").should("be.visible").click();
    cy.wait("@postRecommendation");

    cy.get("input[placeholder=Name]")
      .should("be.visible")
      .type(recommendation.name);
    cy.get("input[placeholder='https://youtu.be/...'")
      .should("be.visible")
      .type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get("button").should("be.visible").click();
    cy.wait("@postRecommendation");

    cy.contains(recommendation.name).its("length").should("eq", 1);
  });
});
