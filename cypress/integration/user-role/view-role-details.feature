Feature: A user role's details can be displayed

    Scenario: The user-manager opens the details of a user role
        Given a user role exist
        And the user-manager navigated to the user role list view
        When the user-manager inspects a user role's details
        Then the user-manager should be presented with the user role's details
