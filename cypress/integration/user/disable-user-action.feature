Feature: A user can be disabled in the list view

    Scenario: A user account gets disabled
        Given at least one enabled user exists
        And the user-manager navigated to the user list view
        When the user-manager disabled an enabled user by using a row action
        Then the user should be disabled

    Scenario: A disabled user account gets enabled
        Given at least one enabled user exists
        And the user-manager navigated to the user list view
        When the user-manager enabled an disabled user by using a row action
        Then the user should be enabled
