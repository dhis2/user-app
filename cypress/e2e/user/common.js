import { Given } from '@badeball/cypress-cucumber-preprocessor'

Given('some users exist', () => {})

Given('the user-manager navigated to the user list view', () => {
    cy.visit('/#/users')
    cy.findByRole('heading', { name: 'User Management' }).should('exist')
})
