import conf from "../../../lexis-client/src/config/default.json"

//coverage: data-sets-list.js data-sets-create.js data-sets-stage-delete.js

describe("datasets, Test Creation with Metadata", function () {
  it("Create a new dataset with metadata, and then delete it.", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-btn-create]").click()
    cy.get("[cy=datasets-metadata-form-project]").select("LEXIS project 4")
    cy.get("[cy=datasets-metadata-form-access]").select("user")
    cy.get("[cy=datasets-metadata-form-title]").type("New dataset")
    cy.get("[cy=datasets-metadata-form-publicationYear]").type("2020")
    cy.get("[cy=datasets-metadata-form-resourceTypeGeneral]").select("Software")
    cy.get("[cy=datasets-metadata-form-custom-metadata]").type('{"city": "London"}', 
	{parseSpecialCharSequences: false})
    cy.get("[cy=datasets-metadata-form-btn-submit]").click()
    cy.wait(500)
    cy.screenshot()
    cy.get("[cy=dataset-btn-stage-deletion]").click()
    cy.get("[cy=datasets-stage-delete-form-btn-submit]").click()
    cy.wait(500)
    cy.screenshot()
  })
})
