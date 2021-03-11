Feature: A user group can be deleted

    Scenario: A user group gets deleted
        Given at least one user group exists
        And the implementer navigated to the user group list view
        When the implementer deletes a user group
        Then the implementer group should be deleted
