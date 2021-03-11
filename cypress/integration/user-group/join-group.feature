Feature: The currently logged in user can join a user group

    Scenario: The user joins a user group
        Given a user group exists
        And the implementer is not part of that group
        And the implementer has permissions to join that group
        And the implementer navigated to the user group list view
        When the implementer joins that user group
        Then the implementer should have be assigned to that user group

    Scenario: The user can't join a user group due to permissions
        Given a user group exists
        And the implementer is not part of that group
        And the implementer does not have permissions to join that group
        And the implementer navigated to the user group list view
        Then the implementer should not be able to join that group

    Scenario: The user can't join a user group as he's already in the group
        Given a user group exists
        And the implementer is part of that group
        And the implementer has permissions to join that group
        And the implementer navigated to the user group list view
        Then the implementer should not be able to join that group
