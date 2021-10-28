Feature: A message can be sent to a user

    Scenario: The user-manager opens the profile details of a user
        Given s user exist
        And the user-manager navigated to a user's profile page
        Then a link should exists that redirects the user to the messaging app
        And the link contains the path to the create message view
        And the link contains the users id
