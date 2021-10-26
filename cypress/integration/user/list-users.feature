Feature: Users can be listed

    Scenario: The user-manager opens the first page of all users
        Given some users exist
        And the user-manager navigated to the user list view
        Then the user-manager should see the first page of all users

    Scenario: The user-manager opens the second page of all users
        Given enough users exist to show a second page and the user-manager navigated to the user list view
        When the user-manager opens the next page
        Then the user-manager should see the second page of all users
