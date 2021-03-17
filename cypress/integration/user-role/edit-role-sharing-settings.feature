Feature: A user role's sharing settings can be edited

    Scenario: The user accesses a roles sharing settings
        Given at least one user role exists
        And the user-manager navigated to the user role list view
        When the user-manager navigates to a roles sharing settings
        Then the sharing settings of that role should be displayed
