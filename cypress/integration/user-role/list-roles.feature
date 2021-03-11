Feature: User roles can be listed

    Scenario: The user opens the first page of all user roles
        Given at least one user role exists
        And the implementer navigated to the user role list view
        Then the implementer should see the first page of all user roles

    Scenario: The user opens the second page of all user roles
        Given enough user roles exist to show a second page
        And the implementer navigated to the user role list view
        When the implementer opens the next page
        Then user should see the second page of all user roles

    Scenario: A user role list item contains the user role's display name
        Given at least one user role exists
        And the implementer navigated to the user role list view
        Then the display name of every user role is displayed

    Scenario: A user role list item contains the user role's description
        Given at least one user role exists
        And the implementer navigated to the user role list view
        Then the description of every user role is displayed
