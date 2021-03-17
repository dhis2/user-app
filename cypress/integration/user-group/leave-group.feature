Feature: The currently logged in user can leave a user group

    Scenario: The user-manager leaves a user group
        Given a user group exists
        And the user-manager is part of that group
        And the user-manager navigated to the user group list view
        When the user-manager leaves that user group
        Then the user-manager should not be assigned to that user group

    Scenario: The user-manager can't leave a user group as he is not in the group
        Given a user group exists
        And the user-manager is not part of that group
        And the user-manager navigated to the user group list view
        Then the user-manager should not be able to leave that group
