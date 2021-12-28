import conf from "../../../lexis-client/src/config/default.json"

module.exports = describe("project-user-assignment", function () {
    it("User with proper role (PRJ_MGR etc) should be able to assign user to Lexis project", function () {
        cy.viewport(1920, 900)
    
        cy.visit(`${conf.url.base}/projects`)
        cy.get('table[cy=projects-list-table] > tbody > tr:nth-child(1) > .text-left:nth-child(1) > button:nth-child(1)').click()
        cy.get('[cy=project-btn-user-management]').click()
        cy.screenshot()
        cy.get('[cy=assign-user-to-project]').click()
        cy.get('[cy=project-add-user-field] > div').click()
        cy.get('#react-select-2-input').type('rosella');
        cy.screenshot()
        cy.get('[cy=project-add-user-field] > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)').click()
        cy.screenshot()
        cy.get('[cy=assign-user]').click()
        cy.wait(500)
        cy.get('table[cy=project-users-list] > tbody').within(()=>{
            cy.contains('Rosella')
        })
    })
    // TODO: blocking, blocking until remove specific role will work
    // it("User with proper role (PRJ_MGR etc) should be able to unassign user from Lexis project", function () {
    //     cy.viewport(1920, 900)
    
    //     cy.visit(`${conf.url.base}/projects`)
    //     cy.get('table[cy=projects-list-table] > tbody > tr:nth-child(1) > .text-left:nth-child(1) > button:nth-child(1)').click()
    //     cy.get('[cy=project-btn-user-management]').click()
    //     cy.screenshot()
    //     cy.get('table[cy=project-users-list] > tbody > tr:last-child > td > button[cy=button-unassign-user]').click()
    //     cy.wait(200)
    //     cy.screenshot()
    // })
})
