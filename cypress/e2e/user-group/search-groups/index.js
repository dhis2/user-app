import '../common.js'
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'

const NAME_SEARCH_QUERY = 'admin'

When('the user-manager searches the list by entering a name', () => {
    cy.getWithDataTest('{search-filter}').type(NAME_SEARCH_QUERY)
    cy.get(
        '[data-test="dhis2-uicore-tablebody"] [data-test="dhis2-uicore-datatablerow"]'
    ).should('have.length', 4)
})

Then(
    'only the user groups whose display name contains the search term should be displayed',
    () => {
        cy.get('[data-test="dhis2-uicore-tablebody"] tr td:first-child').each(
            ($td) => {
                cy.wrap($td).contains(NAME_SEARCH_QUERY, { matchCase: false })
            }
        )
    }
)

Given('the user-manager filtered the list', () => {
    cy.getWithDataTest('{search-filter}').type(NAME_SEARCH_QUERY)
    cy.get(
        '[data-test="dhis2-uicore-tablebody"] [data-test="dhis2-uicore-datatablerow"]'
    ).should('have.length', 4)
})

When('the user-manager edits one of the displayed user groups', () => {
    cy.getWithDataTest('{context-menu-button}').first().click()
    cy.getWithDataTest('{dhis2-uicore-menu}').contains('Edit').click()
    cy.findByRole('heading', { name: 'Edit group' }).should('exist')
})

When('returns to the list view without saving', () => {
    cy.findByRole('button', { name: 'Cancel without saving' }).click()
    cy.findByRole('heading', { name: 'User Group Management' }).should('exist')
})

Then('the previously applied search should still be applied', () => {
    cy.getWithDataTest('{search-filter}')
        .find('input')
        .should('have.value', NAME_SEARCH_QUERY)
})
