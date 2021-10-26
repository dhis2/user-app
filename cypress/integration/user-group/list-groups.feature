Feature: User groups can be listed

    Scenario: The user opens the first page of all user groups
        Given some user groups exist
        And the user-manager navigated to the user group list view
        Then the user-manager should see the first page of all user groups

    Scenario: The user opens the second page of all user groups
        Given enough user groups exist to show a second page the user-manager navigated to the user group list view
        When the user-manager opens the next page
        Then the user-manager should see the second page of all user groups
