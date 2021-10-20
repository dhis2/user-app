Feature: A user group's sharing settings can be edited

    Scenario: The user-manager accesses a groups sharing settings
        Given at least one user group exists
        And the user-manager navigated to the user group list view
        When the user-manager navigates to a groups sharing settings
        Then the sharing settings of that group should be displayed

    Scenario: The user-manager changes the sharings of a group
        Given at least one user group exists
        And the user-manager opened a group's sharing settings
        When the user-manager changes a sharing setting
        Then the app should send the correct request
