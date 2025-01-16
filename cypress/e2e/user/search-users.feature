Feature: The user list can be searched

    Scenario: The user list gets filtered by name
        Given some users exist
        And the user-manager navigated to the user list view
        When the user-manager searches the list by entering a name
        Then only the users whose username or display name contains the search term should be displayed

    # Scenario: The user list gets filtered by organisation unit
    #     Given some users exist
    #     And the user-manager navigated to the user list view
    #     When the user-manager searches the list by selecting an organisation unit
    #     Then only the users belonging to that organisation unit should be shown

    # Scenario: The user list gets filtered by inactivity
    #     Given some users exists that have been inactive for some time
    #     And the user-manager navigated to the user list view
    #     When the user-manager chooses an inactivity time
    #     Then only the users who have been inactive for the chosen time should be displayed

    # Scenario: The user list gets filtered by self registration
    #     Given some users exists that have been inactive for some time
    #     And the user-manager navigated to the user list view
    #     When the user-manager chooses to view only self-registered users
    #     Then only the users who have registered themselves should be displayed

    Scenario: The user-manager returns to the search results after opening the edit form
        Given some users exist
        And the user-manager navigated to the user list view
        And the user-manager filtered the list
        When the user-manager edits one of the displayed users
        And returns to the list view without saving
        Then the previously applied search should still be applied

    # Scenario: The user-manager returns to the search results after editing a user
    #     Given some users exist
    #     And the user-manager navigated to the user list view
    #     And the user-manager filtered the list
    #     When the user-manager edits one of the displayed users
    #     And saves the changes
    #     Then the user-manager should return to the list view
    #     And the previously applied search should still be applied
