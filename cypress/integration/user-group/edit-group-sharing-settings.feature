Feature: A user group's sharing settings can be edited

    Scenario: The user accesses a groups sharing settings
        Given at least one user group exists
        And the implementer navigated to the user group list view
        When the implementer navigates to a groups sharing settings
        Then the sharing settings of that group should be displayed
