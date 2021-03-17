Feature: A user's profile details can be displayed

    Scenario: The user-manager opens the profile details of a user
        Given a user exist
        And the user-manager navigated to the user list view
        When the user-manager inspects a users profile
        Then the user-manager should be presented with the users profile data
