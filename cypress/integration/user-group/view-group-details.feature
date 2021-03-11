Feature: A user group's details can be displayed

    Scenario: The user opens the details of a user group
        Given a user group exist
        And the implementer navigated to the user group list view
        When the implementer inspects a user group's details
        Then the implementer should be presented with the user group's details
