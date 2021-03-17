Feature: A user group's sharing settings can be edited

    Scenario: The user-manager accesses a groups sharing settings
        Given at least one user group exists
        And the user-manager navigated to the user group list view
        When the user-manager navigates to a groups sharing settings
        Then the sharing settings of that group should be displayed
