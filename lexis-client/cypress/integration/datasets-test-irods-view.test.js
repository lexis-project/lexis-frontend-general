// FIXME due to the new whole UI of Data sets not working temporarily
import conf from "../../../lexis-client/src/config/default.json"

//coverage data-sets-list.js data-sets-detail.js data-sets-filelist.js
//  data-sets-view.js data-sets-nav.js

describe("datasets, Test View", function () {
  it("View an image from a dataset, and screenshot at 10s intervals to see it being changed from the back-end", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-list-item-btn-edcca382-b1a4-11ea-8c4e-0050568fc9b5]").click()
    cy.get("[cy=dataset-btn-filelist]").click()
    cy.get("[cy='dataset-filelist-btn-view-item-2020-07-01-08:22:18/wrf/image.png']").click()
    cy.wait(500)
    cy.screenshot()
    for (var i = 0; i < 10; i++) {
	    cy.wait(10000)
	    cy.screenshot()
    }
  })
})
