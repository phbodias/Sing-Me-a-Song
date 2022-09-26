import { recommendationFac } from "../factories/createRecomFacs/rightRecomFactory.js";

beforeEach(() => {
  cy.request("POST", "http://localhost:5000/resetdb");
});

describe("No recommendations yet! Create your own :)", () => {
  it("no recommendations yet", () => {
    const recommendation = recommendationFac();

    cy.intercept("GET", "/recommendations").as("getRecommendation");
    cy.visit("http://localhost:3000");
    cy.wait("@getRecommendation");

    cy.contains("No recommendations yet! Create your own :)").should(
      "be.visible"
    );
  });
});

describe("tests for pages", () => {
  it("show 10 recommendations in 'home'", () => {
    cy.request("POST", "http://localhost:5000/populateDB").then(() => {
      cy.intercept("GET", "/recommendations").as("getRecommendation");
      cy.visit("http://localhost:3000");
      cy.wait("@getRecommendation");

      cy.get("[data-cy=upvoteButton]").then((elements) => {
        expect(elements.length).equal(10);
      });
    });
  });

  it("show a random recommendation in 'random'", () => {
    cy.request("POST", "http://localhost:5000/populateDB").then(() => {
      cy.visit("http://localhost:3000");

      cy.intercept("GET", "/recommendations").as("getRecommendations");
      cy.wait("@getRecommendations");

      cy.get("[data-cy=randomButton]").click();

      cy.url().should("equal", "http://localhost:3000/random");

      cy.get("[data-cy=upvoteButton]").then((elements) => {
        expect(elements.length).equal(1);
      });
    });
  });

  it("visits 'top' and show recommendations ordered by score", () => {
    cy.visit("http://localhost:3000");

    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.wait("@getRecommendations");

    cy.get("[data-cy=topButton]").click();

    cy.url().should("equal", "http://localhost:3000/top");
  });
});
