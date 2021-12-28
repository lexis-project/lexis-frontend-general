import conf from "../../../lexis-client/src/config/default.json"
import moment from "moment"

module.exports = describe("project-create", function () {
    it("User with proper role (MANAGER etc) should be able to create new Lexis project", function () {
        cy.viewport(1920, 900)

        cy.visit(`${conf.url.base}`)

        let tomorrowDateFormatted = moment()
            .add(1, "days")
            .format("DD. MMM. YYYY")

        cy.get("[cy=main-menu-projects]").click()

        cy.get("[cy=project-btn-create-new").click()

        cy.get("[cy=project-form-projectname]").click()

        cy.get("[cy=project-form-projectname]").type("test project")

        cy.get("[cy=project-form-projectshortname]").click()

        cy.get("[cy=project-form-projectshortname]").type("Test_shortname-WP3")

        cy.get("[cy=project-form-projectdescription]").click()

        cy.get("[cy=project-form-projectdescription]").type(
            "test project description"
        )

        // cy.get("[cy=project-form-projectcontactemail]").click()

        // cy.get("[cy=project-form-projectcontactemail]").type("test@test.com")

        cy.get("[cy=project-form-projectdomain]").select("Natural Sciences")

        cy.get("[cy=project-form-projectstartdate]").click()

        cy.get("[cy=project-form-projectstartdate]").clear()

        cy.get("[cy=project-form-projectstartdate]").type(tomorrowDateFormatted)

        cy.get("[cy=project-form-projecttermination]").click()

        cy.get("[cy=project-form-projecttermination]").clear()

        cy.get("[cy=project-form-projecttermination]").type("01. Dec. 2025")

        cy.get("[cy=project-form-termsconsent]").check({ force: true })

        cy.screenshot()

        cy.get("[cy=project-form-btn-submit]").click()

        cy.wait(500)

        cy.screenshot()
    })
})

module.exports = describe("project-create-shortname-handling", function () {
    it("An user with proper role (MANAGER etc) should be able to create new Lexis project. If the form field with the ProjectShortName is already taken by another project, the user gets informed about the conflict and on the same page (Project creation) can change the given field and sumbit the form again.", function () {
        cy.viewport(1920, 900)

        cy.visit(`${conf.url.base}`)

        let tomorrowDateFormatted = moment()
            .add(1, "days")
            .format("DD. MMM. YYYY")

        cy.get("[cy=main-menu-projects]").click()

        cy.get("[cy=project-btn-create-new").click()

        cy.get("[cy=project-form-projectname]").click()

        cy.get("[cy=project-form-projectname]").type(
            "test project - shortnames"
        )

        cy.get("[cy=project-form-projectshortname]").click()

        cy.get("[cy=project-form-projectshortname]").type("lexis_project")

        cy.get("[cy=project-form-projectdescription]").click()

        cy.get("[cy=project-form-projectdescription]").type(
            "test project - shortnames description"
        )

        // cy.get("[cy=project-form-projectcontactemail]").click()

        // cy.get("[cy=project-form-projectcontactemail]").type("test@test.com")

        cy.get("[cy=project-form-projectdomain]").select("Natural Sciences")

        cy.get("[cy=project-form-projectstartdate]").click()

        cy.get("[cy=project-form-projectstartdate]").clear()

        cy.get("[cy=project-form-projectstartdate]").type(tomorrowDateFormatted)

        cy.get("[cy=project-form-projecttermination]").click()

        cy.get("[cy=project-form-projecttermination]").clear()

        cy.get("[cy=project-form-projecttermination]").type("01. Dec. 2025")

        cy.get("[cy=project-form-termsconsent]").check({ force: true })

        cy.get("[cy=project-form-btn-submit]").click()

        cy.wait(2000)

        cy.get("[cy=project-form-projectshortname]").click()

        cy.get("[cy=project-form-projectshortname]").type("_now_ok")

        cy.get("[cy=project-form-btn-submit]").click()

        cy.wait(500)

        cy.screenshot()
    })
})
