Feature: The currently logged in user can leave a user group

    Scenario: The user leaves a user group
        Given a user group exists
        And the implementer is part of that group
        And the implementer navigated to the user group list view
        When the implementer leaves that user group
        Then the implementer should not be assigned to that user group

    Scenario: The user can't leave a user group as he is not in the group
        Given a user group exists
        And the implementer is not part of that group
        And the implementer navigated to the user group list view
        Then the implementer should not be able to leave that group
