Feature: A user can be deleted

    Scenario: A user account gets deleted
        Given at least one user exists
        And the user-manager navigated to the user list view
        When the user-manager deletes an account
        Then the user should be deleted
