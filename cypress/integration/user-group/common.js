import { Given } from 'cypress-cucumber-preprocessor/steps'

Given('some user groups exist', () => {})

Given('the user-manager navigated to the user group list view', () => {
    cy.visit('/#/user-groups')
    cy.findByRole('heading', { name: 'User Group Management' }).should('exist')
})
