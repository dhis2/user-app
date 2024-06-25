import '../common.js'
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'

Then('the user-manager should see the first page of all user roles', () => {
    cy.getWithDataTest('{dhis2-uiwidgets-pagination-summary}').contains(
        'Page 1'
    )
})

Given(
    'enough user roles exist to show a second page and the user-manager navigated to the user role list view',
    () => {
        cy.visit('/#/user-roles?pageSize=5')
        cy.getWithDataTest('{dhis2-uicore-circularloader}').should('not.exist')
    }
)

When('the user-manager opens the next page', () => {
    cy.getWithDataTest('{dhis2-uiwidgets-pagination-page-next}').should('exist')
    cy.wait(500)
    cy.getWithDataTest('{dhis2-uiwidgets-pagination-page-next}').click()
})

Then('the user-manager should see the second page of all user roles', () => {
    cy.getWithDataTest('{dhis2-uiwidgets-pagination-summary}').contains(
        'Page 2'
    )
})
