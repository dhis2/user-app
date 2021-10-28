Feature: A user group can be added

    Scenario: A new user group with required fields is created
        Given the user-manager is on the add user group page
        When the user-manager enters only the required information
        And submits the form
        Then a new user group should be added
        And the new user group should have all previously provided information

    Scenario: A new user group with all possible values is created
        Given the user-manager is on the add user group page
        When the user-manager fills in all form inputs
        And submits the form
        Then a new user group should be added
        And the new user group should have all previously provided information
