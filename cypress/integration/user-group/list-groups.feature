Feature: User groups can be listed

    Scenario: The user opens the first page of all user groups
        Given at least one user group exists
        And the implementer navigated to the user group list view
        Then the implementer should see the first page of all user groups

    Scenario: The user opens the second page of all user groups
        Given enough user groups exist to show a second page
        And the implementer navigated to the user group list view
        When the implementer opens the next page
        Then user should see the second page of all user groups

    Scenario: A user group list item contains the user group's display name
        Given at least one user group exists
        And the implementer navigated to the user group list view
        Then the display name of every user group is displayed

    Scenario: A user group list item contains whether is member of the user group
        Given at least one user group exists
        And the implementer navigated to the user group list view
        Then the membership status of every user group is indicated
