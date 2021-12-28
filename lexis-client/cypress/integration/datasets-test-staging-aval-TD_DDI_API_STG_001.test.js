// FIXME due to the new whole UI of Data sets not working temporarily
import conf from "../../../lexis-client/src/config/default.json"

//coverage: data-sets-list.js data-sets-stage.js data-sets-queue.js

describe("datasets, Test Staging API availability", function () {
  it("User can stage a dataset from irods into barbora lustre", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-btn-stage-dataset]").click()
    cy.get("[cy=datasets-stage-form-source-system]").select("lrz_iRODS")
    cy.get("[cy=datasets-stage-form-source-path]").type("project/projb82481466cb2db115e0ac42342332b83/edcca382-b1a4-11ea-8c4e-0050568fc9b5")
    cy.get("[cy=datasets-stage-form-target-system]").select("barbora_lustre")
    cy.get("[cy=datasets-stage-form-target-path]").type("test")
    cy.get("[cy=datasets-stage-form-taskid]").type("1")
    cy.get("[cy=datasets-stage-form-jobid]").type("2")
    cy.get("[cy=datasets-stage-form-btn-submit]").click()
    cy.wait(500)
    cy.screenshot()
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-btn-check-operations]").click()
    cy.wait(500)
    cy.screenshot()
  })
})
