Feature: A user role's sharing settings can be edited

    Scenario: The user accesses a roles sharing settings
        Given at least one user role exists
        And the implementer navigated to the user role list view
        When the implementer navigates to a roles sharing settings
        Then the sharing settings of that role should be displayed
