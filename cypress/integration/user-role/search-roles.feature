Feature: The user role list can be searched

    Scenario: The user role list gets filtered by name
        Given some user roles exist
        And the implementer navigated to the user role list view
        When the implementer searches the list by entering a name
        Then only the user roles whos display name contains the search term should be displayed

    Scenario: The user returns to the search results after opening the edit form
        Given some user roles exist
        And the implementer navigated to the user role list view
        And the implementer filtered the list
        When the implementer edits one of the displayed user roles
        And returns to the list view without saving
        Then the previously applied search should still be applied

    Scenario: The user returns to the search results after editing a user
        Given some user roles exist
        And the implementer navigated to the user role list view
        And the implementer filtered the list
        When the implementer edits one of the displayed user roles
        And saves the changes
        Then the implementer should return to the list view
        And the previously applied search should still be applied

    Scenario: The list get filtered and shows no results
        Given some user roles exist
        And the implementer navigated to the user role list view
        When the implementer filters the list so the no results are being displayed
        Then a message should be shown to the user that says that there are no results
