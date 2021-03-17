Feature: Users can be listed

    Scenario: The user-manager opens the first page of all users
        Given at least one user exists
        And the user-manager navigated to the user list view
        Then the user-manager should see the first page of all users

    Scenario: The user-manager opens the second page of all users
        Given enough users exist to show a second page
        And the user-manager navigated to the user list view
        When the user-manager opens the next page
        Then user user should see the second page of all users

    Scenario: A user list item contains the user display name
        Given at least one user exists
        And the user-manager navigated to the user list view
        Then the display name of every user is displayed

    Scenario: A user list item contains the user name
        Given at least one user exists
        And the user-manager navigated to the user list view
        Then the name of every user is displayed

    Scenario: A user list item contains the user's last login time
        Given at least one user exists
        And the user-manager navigated to the user list view
        Then the last login time of every user is displayed

    Scenario: A user list item contains the user's last login time
        Given at least one disabled and one enabled user exists
        And the user-manager navigated to the user list view
        Then disabled state of each user should be displayed
