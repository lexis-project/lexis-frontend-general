import conf from "../../../lexis-client/src/config/default.json"

const updatedMetadata = {
    title: "dataset X with updated metadata",
    publicationYear: "2500",
    creator: "John Doe",
}

module.exports = describe("dataset-update-metadata", function () {
    it("User with proper role should be able to update metadata of a dataset", function () {
        cy.viewport(1920, 900)

        cy.visit(`${conf.url.base}`)

        cy.wait(4000)

        cy.get("[cy=main-menu-datasets]").click()
        
        cy.get("[cy=dataset-table-titles]").first().click()

        cy.get("[cy=dataset-btn-update-metadata]").click()

        cy.get("[cy=datasets-metadata-form-title]").click()

        cy.get("[cy=datasets-metadata-form-title]").clear()

        cy.get("[cy=datasets-metadata-form-title]").type(updatedMetadata.title)

        cy.get("[cy=datasets-metadata-form-publicationYear]").click()

        cy.get("[cy=datasets-metadata-form-publicationYear]").clear()

        cy.get("[cy=datasets-metadata-form-publicationYear]").type(updatedMetadata.publicationYear)

        cy.server({
          method: "POST",
        })

        cy.route(
          `${conf.url.api}/api/v0.2/dataset`
        ).as("updateDatasetMetadata")

        cy.get("[cy=datasets-metadata-form-btn-submit]").click()

        cy.wait(1000)

        cy.wait("@updateDatasetMetadata").then(xhr => {
          
          const updateDatasetMetadata = xhr.request.body
          
          cy.get("[cy=dataset-detail-advanced-options]").click()
          
          cy.get("[cy=dataset-detail-title]").should(
              "have.text",
              "" + updateDatasetMetadata.metadata.title
          )

          cy.get("[cy=dataset-detail-publication-year]").should(
            "have.text",
            "" + updateDatasetMetadata.metadata.publicationYear
        )

        })
    })
})
