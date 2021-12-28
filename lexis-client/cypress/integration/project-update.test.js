import conf from "../../../lexis-client/src/config/default.json"
import moment from "moment"

module.exports = describe("project-update", function () {
    it(`User with proper role (MANAGER etc) can change name, dates, email and few other descriptive parameters of one individual project`, function () {
        cy.viewport(1920, 900)

        cy.visit(`${conf.url.base}`)

        let tomorrowDateFormatted = moment().add(1, 'days').format("DD. MMM. YYYY")

        cy.get("[cy=main-menu-projects]").click()

        cy.get("[cy=projects-list-table]").find("button").first().click()

        cy.get("[cy=project-btn-update-existing]").click()

        cy.get("[cy=project-form-projectname]").click()

        cy.get("[cy=project-form-projectname]").clear()

        cy.get("[cy=project-form-projectname]").type("LEXIS project 1 change")

        cy.get("[cy=project-form-projectdescription]").click()

        cy.get("[cy=project-form-projectdescription]").clear()

        cy.get("[cy=project-form-projectdescription]").type("test project description changed")

        // cy.get("[cy=project-form-projectcontactemail]").clear()

        // cy.get("[cy=project-form-projectcontactemail]").type("abc1changed@cde.com")

        cy.get("[cy=project-form-projectdomain]").select("Natural Sciences")

        cy.get("[cy=project-form-projectstartdate]").clear()

        cy.get("[cy=project-form-projectstartdate]").type(tomorrowDateFormatted)

        cy.get("[cy=project-form-projecttermination]").clear()

        cy.get("[cy=project-form-projecttermination]").type("30. Jun. 2025")

        cy.get("[cy=project-form-termsconsent]").check({ force: true })

        cy.screenshot()
        
        cy.get("[cy=project-form-btn-submit]").click()

        cy.wait(500)
        cy.screenshot()
    })
})
