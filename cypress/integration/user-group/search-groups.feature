Feature: The user group list can be searched

    Scenario: The user group list gets filtered by name
        Given some user groups exist
        And the user-manager navigated to the user group list view
        When the user-manager searches the list by entering a name
        Then only the user groups whose display name contains the search term should be displayed

    Scenario: The user returns to the search results after opening the edit form
        Given some user groups exist
        And the user-manager navigated to the user group list view
        And the user-manager filtered the list
        When the user-manager edits one of the displayed user groups
        And returns to the list view without saving
        Then the previously applied search should still be applied

    # Scenario: The user returns to the search results after editing a user
    #     Given some user groups exist
    #     And the user-manager navigated to the user group list view
    #     And the user-manager filtered the list
    #     When the user-manager edits one of the displayed user groups
    #     And saves the changes
    #     Then the user-manager should return to the list view
    #     And the previously applied search should still be applied
