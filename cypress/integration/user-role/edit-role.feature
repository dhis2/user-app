Feature: A user role can be edited

    # input fields
    Scenario Outline: A <input> is added to an user role
        Given a user role without <input> exists
        And the user-manager is editing that user role
        When the user-manager enters a new value into the <input> field
        And the user-manager submits the form
        Then the user role should be saved with the new value

        Examples:
            | input |
            | description |

    # input fields
    Scenario Outline: A <input> is edited on an user role
        Given a user role without <input> exists
        And the user-manager is editing that user role
        When the user-manager enters a new value into the <input> field
        And the user-manager submits the form
        Then the user role should be saved with the new value

        Examples:
            | input |
            | description |

    # Multiselect, Transfer & org unit tree inputs
    Scenario Outline: An additional <option> is added to an user role
        Given a user role exists
        And the user-manager is editing that user role
        When the user-manager adds a new value to the <option> field
        And the user-manager submits the form
        Then the user role should be saved with the additional option

        Examples:
            | option |
            | metadata-authorities |
            | apps-authorities |
            | tracker-authorities |
            | import-export-authorities |
            | system-authorities |

    # Multiselect, Transfer & org unit tree inputs
    # Removing a selection when multiple selections are present
    # Should work with both required and optional fields
    Scenario Outline: An additional <option> is removed from an user role
        Given a user role exists with multiple values in the <option> field
        And the user-manager is editing that user role
        When the user-manager removes an additional value from the <option> field
        And the user-manager submits the form
        Then the user role should be saved without the removed value

        Examples:
            | option |
            | metadata-authorities |
            | apps-authorities |
            | tracker-authorities |
            | import-export-authorities |
            | system-authorities |

    # Multiselect, Transfer & org unit tree inputs
    # Removing the only selection
    # Should work with optional fields
    Scenario Outline: The last selection of <option> is removed from an user role
        Given a user role exists with a single value in the <option> field
        And the user-manager is editing that user role
        When the user-manager removes the last value from the <option> field
        And the user-manager submits the form
        Then the user role should be saved without the removed value

        Examples:
            | option |
            | dataOutputAndAnalyticOrgUnits |
            | orgUnits |
            | userGroups |
            | dimensionRestrictionsForDataAnalytics |
