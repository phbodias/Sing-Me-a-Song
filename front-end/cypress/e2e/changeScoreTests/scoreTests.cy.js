beforeEach(() => {
  cy.request("POST", "http://localhost:5000/resetdb");
});

describe("Upvote or downvote a recommendation", () => {
  it("upvote a recommendation", () => {
    cy.visit("http://localhost:3000");

    cy.createRecom();

    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.wait("@getRecommendations");

    cy.get("[data-cy=upvoteButton]").click();

    cy.get("[data-cy=score]").should(($p) => {
      expect($p).to.contain("1");
    });
  });

  it("downvote a recommendation", () => {
    cy.visit("http://localhost:3000");

    cy.createRecom();

    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.wait("@getRecommendations");

    cy.get("[data-cy=downvoteButton]").click();

    cy.get("[data-cy=score]").should(($p) => {
      expect($p).to.contain("-1");
    });
  });

  it("delete a recommendation with score < -5", () => {
    cy.visit("http://localhost:3000");

    cy.createRecom();

    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.wait("@getRecommendations");

    for (let i = 0; i < 6; i++) {
      cy.get("[data-cy=downvoteButton]").click();
      cy.wait("@getRecommendations");
    }

    cy.get("[data-cy=name]").should("not.exist");
  });
});

