Feature: User roles can be listed

    Scenario: The user-manager opens the first page of all user roles
        Given at least one user role exists
        And the user-manager navigated to the user role list view
        Then the user-manager should see the first page of all user roles

    Scenario: The user-manager opens the second page of all user roles
        Given enough user roles exist to show a second page
        And the user-manager navigated to the user role list view
        When the user-manager opens the next page
        Then user should see the second page of all user roles

    Scenario: A user role list item contains the user role's display name
        Given at least one user role exists
        And the user-manager navigated to the user role list view
        Then the display name of every user role is displayed

    Scenario: A user role list item contains the user role's description
        Given at least one user role exists
        And the user-manager navigated to the user role list view
        Then the description of every user role is displayed
