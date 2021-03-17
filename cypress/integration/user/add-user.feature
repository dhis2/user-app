Feature: A user can be added

    Scenario: A new user with required fields is created
        Given the implementer is on the add user page
        When the implementer enters only the required information
        And submits the form
        Then a new user should be added
        And the new user should have all previously provided information

    Scenario: A new user with all possible values is created
        Given the implementer is on the add user page
        When the implementer fills in all form inputs
        And submits the form
        Then a new user should be added
        And the new user should have all previously provided information
