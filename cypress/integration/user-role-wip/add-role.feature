Feature: A user role can be added

    Scenario: A new user role with required fields is created
        Given the user-manager is on the add user role page
        When the user-manager enters only the required information
        And submits the form
        Then a new user role should be added
        And the new user role should have all previously provided information

    Scenario: A new user role with all possible values is created
        Given the user-manager is on the add user role page
        When the user-manager fills in all form inputs
        And submits the form
        Then a new user role should be added
        And the new user role should have all previously provided information
