Feature: A user can be added

    Scenario: A new user with required fields is created
        Given the user-manager is on the add user page
        When the user-manager enters only the required information
        And submits the form
        Then a new user should be added
        And the new user should have all previously provided information

    Scenario: A new user with all possible values is created
        Given the user-manager is on the add user page
        When the user-manager fills in all form inputs
        And submits the form
        Then a new user should be added
        And the new user should have all previously provided information
