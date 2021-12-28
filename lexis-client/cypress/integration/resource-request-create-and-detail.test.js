import conf from "../../../lexis-client/src/config/default.json"

module.exports = describe("resource-dynamic-create", function () {
  it("User with right privileges can add new request for dynamic HPC resource to particular project.", function () {
    cy.viewport(1920, 900)

    cy.visit(`${conf.url.base}`)

    cy.visit(`${conf.url.base}/projects`)

    cy.get("[cy=projects-list-table]")
      .find("button")
      .first()
      .click()
      .then(() => {
        cy.get("[cy=resource-dynamic-btn-adddynamic]").click()

        cy.get("[cy=resource-dynamic-form-primaryinvestigator]").type(
          "pi@test.com"
        )

        cy.get("[cy=resource-dynamic-form-hpcprovider]").select("IT4I")

        cy.get("[cy=resource-dynamic-form-corehoursexpected]").type(1000)

        cy.get("[cy=resource-dynamic-form-budget]").type(10000)

        cy.get("[cy=resource-dynamic-form-resourcestartdate]").click()

        cy.get("[cy=resource-dynamic-form-resourcestartdate]").clear()

        cy.get("[cy=resource-dynamic-form-resourcestartdate]").type(
          "01. Dec. 2020"
        )

        cy.get("[cy=resource-dynamic-form-resourcetermination]").click()

        cy.get("[cy=resource-dynamic-form-resourcetermination]").clear()

        cy.get("[cy=resource-dynamic-form-resourcetermination]").type(
          "23. Dec. 2020"
        )

        cy.get("[cy=resource-dynamic-form-containerselection]")
          .find("input")
          .first()
          .check({
            force: true,
          })

        cy.get("[cy=resource-dynamic-form-containerselection]")
          .find("input")
          .last()
          .check({
            force: true,
          })

        cy.get("[cy=resource-dynamic-form-termsconsent]").check({
          force: true,
        })

        cy.screenshot()

        cy.server({
          method: "POST"
        })

        cy.route(`${conf.url.api}/api/v0.2/approval_system/resourceRequest`).as("postResourceRequest")

        cy.get("[cy=resource-dynamic-form-btn-submit]").click()

        cy.wait(1000)

        cy.wait("@postResourceRequest").then((xhr) => {
          const requestBodyOfResourceRequest = xhr.request.body

          cy.wait(1000)
          
          cy.get("[cy=resourcesrequests-list-table]").find("button").last().click().then(() => {
            
            cy.get("[cy=resourcesrequests-detail-approvalstatus]").should("have.text", requestBodyOfResourceRequest.ApprovalStatus)

            cy.get("[cy=resourcesrequests-detail-lexisprojectname]").should("have.text", requestBodyOfResourceRequest.LEXISProjectName)

            cy.get("[cy=resourcesrequests-detail-lexisprojectid]").should("have.text", requestBodyOfResourceRequest.LEXISProjectID)

            cy.get("[cy=resourcesrequests-detail-primaryinvestigator]").should("have.text", requestBodyOfResourceRequest.PrimaryInvestigator)

            cy.get("[cy=resourcesrequests-detail-corehoursexpected]").should("have.text", ""+requestBodyOfResourceRequest.CoreHoursExpected)

            cy.get("[cy=resourcesrequests-detail-budget]").should("have.text", ""+requestBodyOfResourceRequest.Budget)

            cy.get("[cy=resourcesrequests-detail-termsconsent]").should("have.text", ""+requestBodyOfResourceRequest.TermsConsent)

            cy.wait(500)
            
            cy.screenshot()
          })
        })
      })
  })
})
