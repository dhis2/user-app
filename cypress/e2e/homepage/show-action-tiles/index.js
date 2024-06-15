import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('the user-manager is on the homepage', () => {
    cy.visit('/')
})

When('the user-manager clicks on the user list icon of the user tile', () => {
    cy.findByRole('heading', { name: 'User' })
        .parents('[data-test="dhis2-uicore-card"]')
        .findByRole('button', { name: 'List' })
        .click()
})

When('the user-manager clicks on the add user icon of the user tile', () => {
    cy.findByRole('heading', { name: 'User' })
        .parents('[data-test="dhis2-uicore-card"]')
        .findByRole('button', { name: 'Add' })
        .click()
})

When(
    'the user-manager clicks on the add user group icon of the user group tile',
    () => {
        cy.findByRole('heading', { name: 'User group' })
            .parents('[data-test="dhis2-uicore-card"]')
            .findByRole('button', { name: 'Add' })
            .click()
    }
)

When(
    'the user-manager clicks on the add user role icon of the user role tile',
    () => {
        cy.findByRole('heading', { name: 'User role' })
            .parents('[data-test="dhis2-uicore-card"]')
            .findByRole('button', { name: 'Add' })
            .click()
    }
)

When(
    'the user-manager clicks on the user group list icon of the user group tile',
    () => {
        cy.findByRole('heading', { name: 'User group' })
            .parents('[data-test="dhis2-uicore-card"]')
            .findByRole('button', { name: 'List' })
            .click()
    }
)

When(
    'the user-manager clicks on the user role list icon of the user role tile',
    () => {
        cy.findByRole('heading', { name: 'User role' })
            .parents('[data-test="dhis2-uicore-card"]')
            .findByRole('button', { name: 'List' })
            .click()
    }
)

Then('the user-manager should be redirected to the user list page', () => {
    cy.url().should('match', /[/]users/)
    cy.findByRole('nav').should('exist')
})

Then('the user-manager should be redirected to the add user form page', () => {
    cy.url().should('match', /[/]users[/]new/)
    cy.get('form').should('exist')
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

Then('the user-manager should be redirected to the user role list page', () => {
    cy.url().should('match', /[/]user-roles/)
})
