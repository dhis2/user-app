Feature: A user group can be deleted

    Scenario: A user group gets deleted
        Given at least one user group exists
        And the user-manager navigated to the user group list view
        When the user-manager deletes a user group
        Then the user-manager group should be deleted
