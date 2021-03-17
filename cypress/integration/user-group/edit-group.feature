Feature: A user group can be edited

    # input fields
    Scenario Outline: A <input> is added to an user group
        Given a user group without <input> exists
        And the user-manager is editing that user group
        When the user-manager enters a new value into the <input> field
        And the user-manager submits the form
        Then the user group should be saved with the new value

        Examples:
            | input |
            | code |

    # input fields
    Scenario Outline: A <input> is edited on an user group
        Given a user group without <input> exists
        And the user-manager is editing that user group
        When the user-manager enters a new value into the <input> field
        And the user-manager submits the form
        Then the user group should be saved with the new value

        Examples:
            | input |
            | name |
            | code |

    # Multiselect, Transfer & org unit tree inputs
    Scenario Outline: An additional <option> is added to an user group
        Given a user group exists
        And the user-manager is editing that user group
        When the user-manager adds a new value to the <option> field
        And the user-manager submits the form
        Then the user group should be saved with the additional option

        Examples:
            | option |
            | managed-user-groups |

    # Multiselect, Transfer & org unit tree inputs
    # Removing a selection when multiple selections are present
    # Should work with both required and optional fields
    Scenario Outline: An additional <option> is removed from an user group
        Given a user group exists with multiple values in the <option> field
        And the user-manager is editing that user group
        When the user-manager removes an additional value from the <option> field
        And the user-manager submits the form
        Then the user group should be saved without the removed value

        Examples:
            | option |
            | managed-user-groups |

    # Multiselect, Transfer & org unit tree inputs
    # Removing the only selection
    # Should work with optional fields
    Scenario Outline: The last selection of <option> is removed from an user group
        Given a user group exists with a single value in the <option> field
        And the user-manager is editing that user group
        When the user-manager removes the last value from the <option> field
        And the user-manager submits the form
        Then the user group should be saved without the removed value

        Examples:
            | option |
            | managed-user-groups |
