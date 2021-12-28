// FIXME due to the new whole UI of Data sets not working temporarily
import conf from "../../../lexis-client/src/config/default.json"

//coverage data-sets-list.js data-sets-detail.js data-sets-metadata-update.js

describe("datasets, Update Metadata", function () {
  it("Update metadata of an existing dataset", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-list-item-btn-edcca382-b1a4-11ea-8c4e-0050568fc9b5]").click()
    cy.get("[cy=dataset-btn-update-metadata]").click()
    cy.get("[cy=datasets-metadata-form-title]").clear().type("New dataset")
    cy.get("[cy=datasets-metadata-form-btn-submit]").click()
    cy.wait(500)
    cy.screenshot()
  })
})
