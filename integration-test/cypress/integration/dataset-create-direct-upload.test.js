import "cypress-file-upload"
import conf from "../../../lexis-client/src/config/default.json"

const fixtureZip = "image.zip"

module.exports = describe("dataset-create-direct-upload", function () {
    it("User with proper role should be able to create new dataset by uploading ZIP file", function () {
        cy.viewport(1920, 900)

        cy.visit(`${conf.url.base}`)

        cy.wait(4000)

        cy.get("[cy=main-menu-datasets]").click()

        cy.get("[cy=dataset-btn-create]").click()

        cy.get("[cy=datasets-fragment-upload-file]").attachFile(fixtureZip)

        cy.get("[cy=datasets-fragment-uploadtype]").select("Direct Upload")

        cy.get("[cy=datasets-fragment-filetype]").select("Archive ZIP")

        cy.get("[cy=datasets-basic-form-title]").click()

        cy.get("[cy=datasets-basic-form-title]").type("Upload dataset test")

        cy.get("[cy=datasets-basic-form-project]").select("TWO 2 2")

        cy.get("[cy=datasets-basic-form-access]").select("Project limited access")

        cy.get("[cy=datasets-basic-form-zone]").select("IT4ILexisZone")

        cy.get("[cy=datasets-basic-form-nextwizard]").click()

        cy.wait(500)

        cy.get("[cy=datasets-metadata-form-resourcetype]").click()

        cy.get("[cy=datasets-metadata-form-resourcetype]").type("heat map")

        cy.get("[cy=datasets-metadata-form-generaltype]").select("Image")
        
        cy.get("[cy=datasets-metadata-form-creator-addbutton]").click()
        
        cy.get("[cy=datasets-metadata-form-creator]").type("John Doe")

        cy.get("[cy=datasets-metadata-form-contributor-addbutton]").click()

        cy.get("[cy=datasets-metadata-form-contributor]").type("Jane Doe")
        
        cy.get("[cy=datasets-metadata-form-publisher-addbutton]").click()

        cy.get("[cy=datasets-metadata-form-publisher]").type("NASA")
        
        cy.get("[cy=datasets-metadata-form-owner-addbutton]").click()

        cy.get("[cy=datasets-metadata-form-owner]").type("Foo Bar")

        cy.get("[cy=datasets-metadata-form-rights-addbutton]").click()

        cy.get("[cy=datasets-metadata-form-rights]").type("MIT")
        
        cy.get("[cy=datasets-metadata-form-rightsuri-addbutton]").click()

        cy.get("[cy=datasets-metadata-form-rightsuri]").type("http://some.uri")

        cy.get("[cy=datasets-metadata-form-finalize]").click()

        cy.server({
          method: "POST",
        })

        cy.route(
          `${conf.url.api}/api/v0.2/dataset`
        ).as("postCreateDataset")

        cy.get("[cy=datasets-create-form-confirm-and-upload]").click()

        cy.wait(1000)

        cy.wait("@postCreateDataset").then(xhr => {
            const requestBodyOfCreateDataset = xhr.request.body

            cy.wait(1000)

            cy.get("[cy=go-to-dataset-detail]").click()

            cy.get("[cy=dataset-detail-advanced-options]").click()

            cy.get("[cy=dataset-detail-title]").should(
                "have.text",
                "" + requestBodyOfCreateDataset.metadata.title
            )

            cy.get("[cy=dataset-detail-access]").should(
                "have.text",
                "" + requestBodyOfCreateDataset.access
            )

            cy.get("[cy=dataset-detail-resource-type]").should(
                "have.text",
                "" + requestBodyOfCreateDataset.metadata.resourceType
            )
        })
    })
})
