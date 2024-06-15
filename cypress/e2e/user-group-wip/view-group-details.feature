Feature: A user group's details can be displayed

    Scenario: The user opens the details of a user group
        Given a user group exist
        And the user-manager navigated to the user group list view
        When the user-manager inspects a user group's details
        Then the user-manager should be presented with the user group's details
