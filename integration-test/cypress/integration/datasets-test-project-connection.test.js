import conf from "../../../lexis-client/src/config/default.json"
import 'cypress-file-upload';

//coverage data-sets-list.js data-sets-detail.js data-sets-filelist.js
//  data-sets-file-upload

describe("datasets, Test File Upload", function () {
  it("Test File Upload", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.wait(500)
    cy.screenshot()
    cy.get("[cy=dataset-project-button-btn-edcca382-b1a4-11ea-8c4e-0050568fc9b5]").click()
    cy.wait(500)
    cy.screenshot()
  })
})
