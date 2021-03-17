Feature: A user role can be added

    Scenario: A new user role with required fields is created
        Given the implementer is on the add user role page
        When the implementer enters only the required information
        And submits the form
        Then a new user role should be added
        And the new user role should have all previously provided information

    Scenario: A new user role with all possible values is created
        Given the implementer is on the add user role page
        When the implementer fills in all form inputs
        And submits the form
        Then a new user role should be added
        And the new user role should have all previously provided information
