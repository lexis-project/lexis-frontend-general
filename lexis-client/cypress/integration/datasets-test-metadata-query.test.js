// FIXME due to the new whole UI of Data sets not working temporarily
import conf from "../../../lexis-client/src/config/default.json"

//coverage data-sets-list.js data-sets-search.js

describe("datasets, Refine metadata search", function () {
  it("Refine metadata search", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-btn-refine-metadata]").click()
    cy.get("[cy=datasets-metadata-query-form-title]").type("x")
    cy.get("[cy=datasets-metadata-query-form-btn-submit]").click()
    cy.wait(500)
    cy.screenshot()
    cy.get("[cy=dataset-list-item-btn-edcca382-b1a4-11ea-8c4e-0050568fc9b5]").should('not.exist');
  })
})
