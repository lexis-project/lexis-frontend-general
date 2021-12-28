// FIXME due to the new whole UI of Data sets not working temporarily
import conf from "../../../lexis-client/src/config/default.json"

//coverage: data-sets-list.js data-sets-stage.js data-sets-sshfs-add.js
//  data-sets-sshfs-remove.js

describe("datasets, Test SSHFS", function () {
  it("Add and remove an ssh export for a dataset located at the lrz staging area", function () {
    cy.viewport(1920, 900)
    cy.visit(`${conf.url.base}`)
    cy.get("[cy=main-menu-projects]").click()
    cy.get("[cy=main-menu-datasets]").click()
    cy.get("[cy=dataset-btn-stage-dataset]").click()
    cy.get("[cy=dataset-btn-sshfs-add]").click()
    cy.get("[cy=datasets-ssh-add-form-host").type("138.246.234.1")
    cy.get("[cy=datasets-ssh-add-form-pubkey").type("ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDxITMOxeATzBtoq/J7qk7131ug/KVZz683D3rINhEbCEWo6HoddNaZjDfc7Lbut0kqDfUJ46m+R2G8yygyy0+adDL3sPTR0UfDCAnYdBjGxzyGhyUvuh834mvWMSwoeLFzF0pLZ9bKXMaO5hDOqYVxZrOZBdD1RCfG2kv1Zofl8cGaHvtICLlfzzZqrFByJAWGDzjMUm0AXOD1S627G9B59und0eswmEfWl7koVzoj0/TBHd8XXBDBHp5OtYVOiXZCTy7JOIyVp+q+tbyfYyoBRDL7JcScAgW5BrGtZgLbratYAjD3foWfUY3ZQUCxasHa6CEgZ13pQU1iJn8UKCXV examplekey@lexis", {delay:0})
    cy.get("[cy=datasets-ssh-add-form-path").type("9035f786-63a8-4b78-a8f8-d0175fcf0ee0")
    cy.get("[cy=datasets-ssh-add-form-btn-submit]").click()
    cy.wait(500)
    cy.screenshot()
    cy.get("[cy=datasets-ssh-latext-export-remove]").click()
    cy.wait(500)
    cy.screenshot()
    cy.go('back')
    cy.get("[cy=dataset-btn-sshfs-remove]").click()
    cy.get("[cy=datasets-ssh-remove-form-user").type("qlecvxbndl")
    cy.get("[cy=datasets-ssh-remove-form-path").type("3a018dee-abe6-4e4b-9efc-cc0d5423f58c")
    cy.get("[cy=datasets-ssh-remove-form-btn-submit]").click()
    cy.wait(500)
    cy.screenshot()
  })
})
