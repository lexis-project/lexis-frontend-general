import conf from "../../../lexis-client/src/config/default.json"

// FIXME: please uncomment this after fixing resources on BE
// module.exports = describe("resource-approved-create", function () {
//   it("User with right privileges can add new request for approved resource to particular project.", function () {
//     cy.viewport(1920, 900)

//     cy.visit(`${conf.url.base}`)

//     cy.visit(`${conf.url.base}/projects`)

//     cy.get("[cy=projects-list-table]")
//       .find("button")
//       .first()
//       .click()
//       .then(() => {
//         cy.get("[cy=resource-approved-btn-addapproved]").click()

//         cy.get("[cy=resource-approved-form-hpcprovider]").select("IT4I")

//         cy.get("[cy=resource-approved-form-hpcproject]").type(
//           "a92d8e7b-0729-4161-ae00-c3e14dabfeeb"
//         )

//         cy.get("[cy=resource-approved-form-termsconsent]").check({
//           force: true,
//         })

//         cy.screenshot()

//         cy.server({
//           method: "POST",
//         })

//         cy.route(
//           `${conf.url.api}/api/v0.2/approval_system/approvedResourceRequest`
//         ).as("postResourceRequest")

//         cy.get("[cy=resource-approved-form-btn-submit]").click()

//         cy.wait(1000)

//         cy.wait("@postResourceRequest").then((xhr) => {
//           const requestBodyOfResourceRequest = xhr.request.body

//           cy.wait(1000)
          
//           cy.get("[cy=approved-resourcesrequests-list-table]")
//             .find("button")
//             .last()
//             .click()
//             .then(() => {
//               cy.get("[cy=approved-resourcesrequests-detail-hpcproject]").should("have.text", requestBodyOfResourceRequest.HPCProjectID)

//               cy.wait(500)

//               cy.screenshot()
//           })
//         })
//       })
//   })
// })
