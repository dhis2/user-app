import '../common'
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

const NAME_SEARCH_QUERY = 'admin'

When('the user-manager searches the list by entering a name', () => {
    cy.getWithDataTest('{search-filter}').type(NAME_SEARCH_QUERY)
    cy.wait(1000)
})

Then(
    'only the user roles whose display name contains the search term should be displayed',
    () => {
        cy.get('[data-test="dhis2-uicore-tablebody"] tr td:first-child').each(
            $td => {
                cy.wrap($td).contains(NAME_SEARCH_QUERY, { matchCase: false })
            }
        )
    }
)

Given('the user-manager filtered the list', () => {
    cy.getWithDataTest('{search-filter}').type(NAME_SEARCH_QUERY)
})

When('the user-manager edits one of the displayed user roles', () => {
    cy.getWithDataTest('{context-menu-button}').first().click()
    cy.getWithDataTest('{dhis2-uicore-menu}').contains('Edit').click()
    cy.findByRole('heading', { name: /^Update User Authority Group:/ }).should(
        'exist'
    )
})

When('returns to the list view without saving', () => {
    cy.findByRole('button', { name: 'Cancel' }).click()
    cy.findByRole('heading', { name: 'User Role Management' }).should('exist')
})

Then('the previously applied search should still be applied', () => {
    cy.getWithDataTest('{search-filter}')
        .find('input')
        .should('have.value', NAME_SEARCH_QUERY)
})
