import '../common'
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

Given('enough users exist to show a second page', () => {})

Then('the user-manager should see the first page of all users', () => {
    cy.getWithDataTest('{dhis2-uiwidgets-pagination-summary}').contains(
        'Page 1'
    )
})

When('the user-manager opens the next page', () => {
    cy.getWithDataTest('{dhis2-uiwidgets-pagination-page-next}').click()
})

Then('the user-manager should see the second page of all users', () => {
    cy.getWithDataTest('{dhis2-uiwidgets-pagination-summary}').contains(
        'Page 2'
    )
})
