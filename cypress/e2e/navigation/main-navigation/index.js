import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('the user is on the homepage', () => {
    cy.visit('/')
})

Given('the user is on the user group list page', () => {
    cy.visit('/')
    cy.findByRole('nav').findByText('User group').click()
})

Given('the user is on the user list page', () => {
    cy.visit('/')
    cy.findByRole('nav').findByText('User').click()
})

Given('the user is on the user role list page', () => {
    cy.visit('/')
    cy.findByRole('nav').findByText('User role').click()
})

When('the user clicks the user groups link in the main navigation', () => {
    cy.findByRole('nav').findByText('User group').click()
})

When('the user clicks the user roles link in the main navigation', () => {
    cy.findByRole('nav').findByText('User role').click()
})

When('the user clicks the users link in the main navigation', () => {
    cy.findByRole('nav').findByText('User').click()
})

Then('no link in the main navigation should be active', () => {
    cy.findByRole('nav').find('li.active').should('not.exist')
})

Then('the users link in the main navigation should be active', () => {
    cy.findByRole('nav').find('li.active').should('have.length', 1)
    cy.findByRole('nav')
        .findByText('User')
        .parents('li')
        .should('have.class', 'active')
})

Then('the user groups link in the main navigation should be active', () => {
    cy.findByRole('nav').find('li.active').should('have.length', 1)
    cy.findByRole('nav')
        .findByText('User group')
        .parents('li')
        .should('have.class', 'active')
})

Then('the user roles link in the main navigation should be active', () => {
    cy.findByRole('nav').find('li.active').should('have.length', 1)
    cy.findByRole('nav')
        .findByText('User role')
        .parents('li')
        .should('have.class', 'active')
})

Then('the user should be redirected to the user list page', () => {
    cy.url().should('match', /[/]users$/)
})

Then('the user should be redirected to the user group list page', () => {
    cy.url().should('match', /[/]user-groups/)
})

Then('the user should be redirected to the user role list page', () => {
    cy.url().should('match', /[/]user-roles$/)
})
