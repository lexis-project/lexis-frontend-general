// FIXME due to the new whole UI of Data sets not working temporarily
import conf from "../../../lexis-client/src/config/default.json"

//coverage data-sets-list.js data-sets-detail.js data-sets-filelist.js
//  data-sets-zip.js data-sets-nav.js

describe("datasets, Test Multipart creation and Download", function () {
  it("Multipart creation and Download from dataset", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-list-item-btn-edcca382-b1a4-11ea-8c4e-0050568fc9b5]").click()
    cy.get("[cy=dataset-btn-stage-multi]").click()
    cy.wait(500)
    cy.screenshot()
    cy.get("[cy=dataset-multipart-size]").type(1)
    cy.get("[cy=dataset-multipart-btn-save]").click()
    cy.wait(500)
    cy.screenshot()
    cy.get('[cy="dataset-process-files-btn-download"]').click()
//this saves it to disk 
    var save=cy.get("[cy='dataset-process-files-btn-save-to-disk']")
    save.should('have.length', 1)
//actual download fails on cicd
//    save.click()
    cy.wait(500)
    cy.screenshot()
  })
})
