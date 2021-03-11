Feature: A user role can be deleted

    Scenario: A user role gets deleted
        Given at least one user role exists
        And the implementer navigated to the user role list view
        When the implementer deletes a user role
        Then the user role should be deleted
