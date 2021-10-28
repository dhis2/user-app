import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given('the user-manager is on the homepage', () => {
    cy.visit('/')
})

When(
    'the user-manager clicks on the add user group icon of the user group tile',
    () => {
        cy.get('.left-bar + div > div:nth-child(3) button:first-child').click()
    }
)

When('the user-manager clicks on the add user icon of the user tile', () => {
    cy.get('.left-bar + div > div:nth-child(1) button:first-child').click()
})

When(
    'the user-manager clicks on the add user role icon of the user role tile',
    () => {
        cy.get('.left-bar + div > div:nth-child(2) button:first-child').click()
    }
)

When(
    'the user-manager clicks on the user group list icon of the user group tile',
    () => {
        cy.get('.left-bar + div > div:nth-child(3) button:first-child').click()
    }
)

When('the user-manager clicks on the user list icon of the user tile', () => {
    cy.get('.left-bar + div > div:nth-child(1) button:first-child').click()
})

When(
    'the user-manager clicks on the user role list icon of the user role tile',
    () => {
        cy.get('.left-bar + div > div:nth-child(2) button:first-child').click()
    }
)

Then('the user-manager should be redirected to the add user form page', () => {
    cy.url().should('match', /[/]users[/]new/)
})

Then(
    'the user-manager should be redirected to the add user group form page',
    () => {
        cy.url().should('match', /[/]user-groups[/]new/)
    }
)

Then(
    'the user-manager should be redirected to the add user role form page',
    () => {
        cy.url().should('match', /[/]user-roles[/]new/)
    }
)

Then(
    'the user-manager should be redirected to the user group list page',
    () => {
        cy.url().should('match', /[/]user-groups/)
    }
)

Then('the user-manager should be redirected to the user list page', () => {
    cy.url().should('match', /[/]users/)
})

Then('the user-manager should be redirected to the user role list page', () => {
    cy.url().should('match', /[/]user-roles/)
})
