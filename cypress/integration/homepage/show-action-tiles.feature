Feature: Show tiles with list and add action to all available sections

    Scenario: The user navigates to the new user form
        Given the implementer is on the homepage
        When the implementer clicks on the add user icon of the user tile
        Then the implementer should be redirected to the add user form page

    Scenario: The user navigates to the user list
        Given the implementer is on the homepage
        When the implementer clicks on the user list icon of the user tile
        Then the implementer should be redirected to the user list page

    Scenario: The user navigates to the new user role form
        Given the implementer is on the homepage
        When the implementer clicks on the add user role icon of the user role tile
        Then the implementer should be redirected to the add user role form page

    Scenario: The user navigates to the user role list
        Given the implementer is on the homepage
        When the implementer clicks on the user role list icon of the user role tile
        Then the implementer should be redirected to the user role list page

    Scenario: The user navigates to the new user group form
        Given the implementer is on the homepage
        When the implementer clicks on the add user group icon of the user group tile
        Then the implementer should be redirected to the add user group form page

    Scenario: The user navigates to the user group list
        Given the implementer is on the homepage
        When the implementer clicks on the user group list icon of the user group tile
        Then the implementer should be redirected to the user group list page
