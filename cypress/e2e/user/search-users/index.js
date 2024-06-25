import '../common.js'
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'

const NAME_SEARCH_QUERY = 'admin'

When('the user-manager searches the list by entering a name', () => {
    cy.getWithDataTest('{user-filter-name}').type(NAME_SEARCH_QUERY)
    cy.get(
        '[data-test="dhis2-uicore-tablebody"] [data-test="dhis2-uicore-datatablerow"]'
    ).should('have.length', 1)
})

Then(
    'only the users whose username or display name contains the search term should be displayed',
    () => {
        cy.get('[data-test="dhis2-uicore-tablebody"] tr').each(($tr) => {
            // Either the display name cell or the username cell will contain
            // text matching the search query, so check entire row
            cy.wrap($tr).contains(NAME_SEARCH_QUERY, { matchCase: false })
        })
    }
)

When('the user-manager chooses an inactivity time', () => {
    cy.getWithDataTest('{user-filter-time-inactive}').click()
})

Given('the user-manager filtered the list', () => {
    cy.getWithDataTest('{user-filter-name}').type(NAME_SEARCH_QUERY)
    cy.get(
        '[data-test="dhis2-uicore-tablebody"] [data-test="dhis2-uicore-datatablerow"]'
    ).should('have.length', 1)
})

When('the user-manager edits one of the displayed users', () => {
    cy.getWithDataTest('{context-menu-button}')
        .first()
        .should('be.visible')
        .click()
    cy.getWithDataTest('{dhis2-uicore-menu}').should('be.visible')
    cy.getWithDataTest('{dhis2-uicore-menu}').contains('Edit').click()
    cy.findByRole('heading', { name: 'Edit user' }).should('exist')
})

When('returns to the list view without saving', () => {
    cy.findByRole('button', { name: 'Cancel without saving' }).click()
    cy.findByRole('heading', { name: 'User Management' }).should('exist')
})

Then('the previously applied search should still be applied', () => {
    cy.getWithDataTest('{user-filter-name}')
        .find('input')
        .should('have.value', NAME_SEARCH_QUERY)
})
