Feature: A user role can be deleted

    Scenario: A user role gets deleted
        Given at least one user role exists
        And the user-manager navigated to the user role list view
        When the user-manager deletes a user role
        Then the user role should be deleted
