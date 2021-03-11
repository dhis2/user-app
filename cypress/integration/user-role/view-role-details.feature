Feature: A user role's details can be displayed

    Scenario: The user opens the details of a user role
        Given a user role exist
        And the implementer navigated to the user role list view
        When the implementer inspects a user role's details
        Then the implementer should be presented with the user role's details
