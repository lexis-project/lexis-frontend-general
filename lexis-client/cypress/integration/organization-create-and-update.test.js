import conf from "../../../lexis-client/src/config/default.json"

describe("organization-create-and-update", function () {
    it("User should be able to create new organization and assign yourself to it (by setting OrganizationId to his/her profile). After that, user is able to change parameters (name, address, etc) of the organization he/she just created", function () {
        const addedString = " changed" // added to some of input fields when updating organization

        cy.viewport(1920, 900)

        cy.visit(`${conf.url.base}`)

        cy.get("[cy=main-menu-organization]").click()

        cy.get("[cy=organization-btn-create]").click()

        cy.get("[cy=organization-form-name]").click()

        cy.get("[cy=organization-form-name]").type("test organization")

        cy.get("[cy=organization-form-address1]").click()

        cy.get("[cy=organization-form-address1]").type("Test street 1")

        cy.get("[cy=organization-form-address2]").click()

        cy.get("[cy=organization-form-address2]").type("Test app. 1")

        cy.get("[cy=organization-form-address3]").click()

        cy.get("[cy=organization-form-address3]").type("Test district 1")

        cy.get("[cy=organization-form-country]").click()

        cy.get("[cy=organization-form-country]").type("Test country")

        cy.get("[cy=organization-form-website]").click()

        cy.get("[cy=organization-form-website]").type("https://www.it4i.cz/")

        cy.get("[cy=organization-form-emailaddress]").click()

        cy.get("[cy=organization-form-emailaddress]").type("test@test.com")

        cy.get("[cy=organization-form-telephonenumber]").click()

        cy.get("[cy=organization-form-telephonenumber]").type("777123456")

        cy.get("[cy=organization-form-btn-submit]").click()

        cy.wait(500)

        cy.get("[cy=main-menu-organization]").click()

        cy.url().should("include", "/organization")

        cy.get("[cy=organization-btn-update]").click()

        cy.get("[cy=organization-form-name]").click()

        cy.get("[cy=organization-form-name]").type(addedString)

        cy.get("[cy=organization-form-address1]").click()

        cy.get("[cy=organization-form-address1]").type(addedString)

        cy.get("[cy=organization-form-country]").click()

        cy.get("[cy=organization-form-country]").type(addedString)

        cy.get("[cy=organization-form-website]").click()

        cy.get("[cy=organization-form-website]").clear()

        cy.get("[cy=organization-form-website]").type("https://www.vsb.cz/")

        cy.get("[cy=organization-form-emailaddress]").click()

        cy.get("[cy=organization-form-emailaddress]").clear()

        cy.get("[cy=organization-form-emailaddress]").type("change@test.com")

        cy.get("[cy=organization-form-telephonenumber]").click()

        cy.get("[cy=organization-form-telephonenumber]").clear()

        cy.get("[cy=organization-form-telephonenumber]").type("777000111")

        cy.get("[cy=organization-form-address2]").click()

        cy.get("[cy=organization-form-address2]").type(addedString)

        cy.get("[cy=organization-form-address3]").click()

        cy.get("[cy=organization-form-address3]").type(addedString)

        cy.screenshot()

        cy.get("[cy=organization-form-btn-submit]").click()

        cy.wait(500)

        cy.get("[cy=organization-detail-name-submit-result]")
            .contains("p", /.*changed$/)
            .should("be.visible")

        cy.wait(500)
        cy.screenshot()
    })
})
