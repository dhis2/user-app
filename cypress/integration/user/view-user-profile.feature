Feature: A user's profile details can be displayed

    Scenario: The user opens the profile details of a user
        Given a user exist
        And the implementer navigated to the user list view
        When the implementer inspects a users profile
        Then the implementer should be presented with the users profile data
