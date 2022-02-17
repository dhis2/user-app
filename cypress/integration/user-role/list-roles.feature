Feature: User roles can be listed

    Scenario: The user-manager opens the first page of all user roles
        Given some user roles exist
        And the user-manager navigated to the user role list view
        Then the user-manager should see the first page of all user roles

    Scenario: The user-manager opens the second page of all user roles
        Given enough user roles exist to show a second page and the user-manager navigated to the user role list view
        When the user-manager opens the next page
        Then the user-manager should see the second page of all user roles
