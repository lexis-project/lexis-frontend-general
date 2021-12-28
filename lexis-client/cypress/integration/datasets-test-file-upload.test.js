// FIXME due to the new whole UI of Data sets not working temporarily
import conf from "../../../lexis-client/src/config/default.json"
import 'cypress-file-upload';

//coverage data-sets-list.js data-sets-detail.js data-sets-filelist.js
//  data-sets-file-upload

describe("datasets, Test File Upload", function () {
  it("Test File Upload", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-list-item-btn-edcca382-b1a4-11ea-8c4e-0050568fc9b5]").click()
    cy.get("[cy=dataset-btn-filelist]").click()
    cy.wait(500)
    cy.screenshot()
    cy.get("[cy='dataset-filelist-btn-upload-item-2020-07-01-08:22:18']").click()
    cy.wait(500)
    cy.screenshot()
    const fixtureFile = 'image.zip';
    cy.get('[cy="datasets-fragment-upload-file"]').attachFile(fixtureFile);
    cy.get('[cy="data-sets-file-upload-btn"]').click()
//this saves it to disk 
    cy.wait(500)
    cy.screenshot()
  })
})
