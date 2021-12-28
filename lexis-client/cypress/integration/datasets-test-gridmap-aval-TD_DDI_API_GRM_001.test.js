// FIXME due to the new whole UI of Data sets not working temporarily
import conf from "../../../lexis-client/src/config/default.json"

//coverage: data-sets-list.js data-sets-create-eudat.js data-sets-gridmap-buttons.js
//  data-sets-gridmap-add.js data-sets-gridmap-remove.js
describe("datasets, Test GRIDMAP access and EUDAT creation", function () {
  it("Add a new distinguished name to gridmap, remove access via gridmap, then add a dataset using EUDAT view.", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.wait(500)
    cy.get('[cy=dataset-btn-create-eudat]').click()
    cy.get('[cy=dataset-btn-gridmap-add]').click()
    cy.get('[cy=datasets-gridmap-add-form-dn]').type ("CN=Peter Lexis User,O=Peter Company,DC=cilogon,DC=org")
    cy.get('[cy=datasets-gridmap-add-form-btn-submit]').click()
    cy.wait(500)
    cy.screenshot()
    cy.go('back')
    cy.get('[cy=dataset-btn-gridmap-remove]').click()
    cy.get('[cy=datasets-gridmap-remove-form-btn-submit]').click()
    cy.wait(500)
    cy.screenshot()
    cy.go('back')
    cy.get("[cy=datasets-metadata-form-project]").select("LEXIS project ANY account info")
    cy.get("[cy=datasets-metadata-form-access]").select("project")
    cy.get("[cy=datasets-metadata-form-title]").type("New EUDAT dataset")
    cy.get("[cy=datasets-metadata-form-btn-submit]").click()
    cy.wait(500)
    cy.screenshot()
  })
})
