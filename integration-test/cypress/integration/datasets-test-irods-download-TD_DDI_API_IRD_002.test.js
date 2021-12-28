import conf from "../../../lexis-client/src/config/default.json"

//coverage data-sets-list.js data-sets-detail.js data-sets-filelist.js
//  data-sets-zip.js data-sets-nav.js

describe("datasets, Test File Download", function () {
  it("Download file from dataset", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-list-item-btn-edcca382-b1a4-11ea-8c4e-0050568fc9b5]").click()
    cy.get("[cy=dataset-btn-filelist]").click()
    cy.wait(500)
    cy.screenshot()
//    cy.get("[cy='dataset-filelist-btn-download-item-2020-07-01-08:22:18/risico/risico_202006290000.nc']").click()
    cy.get("[cy='dataset-filelist-btn-download-item-2020-07-01-08:22:18/wrf/image.png']").click()
    cy.wait(500)
    cy.screenshot()
    cy.wait(2000)
    cy.screenshot()
//this saves it to disk 
    var save=cy.get("[cy='dataset-zip-btn-save']")
    save.should('have.length', 1)
//actual download fails on cicd
//    save.click()
    cy.wait(500)
    cy.screenshot()
  })
})
