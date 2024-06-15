Feature: A user can be replacated

    Scenario: A new user is created
        Given at least one enabled user exists
        And the user-manager navigated to the user list view
        When the user-manager replicated the user with a new name and password
        Then a new user with the provided name and password should be created

    # Potential for improvement:
    # Disable this action when the user does not have the rquired persmissions
    Scenario: Replicating a user fails due to a lack of the required permissions
        Given at one enabled user exists
        And the current user does not have the permissions to replicate the existing user
        And the user-manager navigated to the user list view
        When the user-manager replicated the user with a new name and password
        Then and error message should be shown
