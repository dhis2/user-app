import { Given } from '@badeball/cypress-cucumber-preprocessor'

Given('some user roles exist', () => {})

Given('the user-manager navigated to the user role list view', () => {
    cy.visit('/#/user-roles')
    cy.findByRole('heading', { name: 'User Role Management' }).should('exist')
})
