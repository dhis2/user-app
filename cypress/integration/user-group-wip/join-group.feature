Feature: The currently logged in user can join a user group

    Scenario: The user-manager joins a user group
        Given a user group exists
        And the user-manager is not part of that group
        And the user-manager has permissions to join that group
        And the user-manager navigated to the user group list view
        When the user-manager joins that user group
        Then the user-manager should have be assigned to that user group

    Scenario: The user-manager can't join a user group due to permissions
        Given a user group exists
        And the user-manager is not part of that group
        And the user-manager does not have permissions to join that group
        And the user-manager navigated to the user group list view
        Then the user-manager should not be able to join that group

    Scenario: The user-manager can't join a user group as he's already in the group
        Given a user group exists
        And the user-manager is part of that group
        And the user-manager has permissions to join that group
        And the user-manager navigated to the user group list view
        Then the user-manager should not be able to join that group
