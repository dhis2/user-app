Feature: A user group can have attributes

    IMPORTANT: In the current state, a user group can be saved without a value for
    mandatory attributes.

    Scenario Outline: Adding a value to an attribute of value type <type>
        Given an attribute of value type <type> that applies to user groups exists
        And a user group exists
        And that user group does not have a value for the attribute
        And a user-manager edits that user group
        When the user-manager enters a value for the attribute
        And saves the user group
        Then the user group should be updated with the new attribute value

        Examples:
            | type |
            | TEXT |
            | LONG_TEXT |
            | BOOLEAN |
            | TRUE_ONLY |
            | DATE |
            | NUMBER |
            | INTEGER |
            | INTEGER_POSITIVE |
            | INTEGER_NEGATIVE |

    Scenario Outline: Changing the value of an attribute of value type <type>
        Given an attribute of value type <type> that applies to user groups exists
        And a user group exists
        And that user group has a value for the attribute
        And a user-manager edits that user group
        When the user-manager enters a different value for the attribute
        And saves the user group
        Then the user group should be updated with the new attribute value

        Examples:
            | type |
            | TEXT |
            | LONG_TEXT |
            | BOOLEAN |
            | TRUE_ONLY |
            | DATE |
            | NUMBER |
            | INTEGER |
            | INTEGER_POSITIVE |
            | INTEGER_NEGATIVE |

    Scenario Outline: Removing the value of an attribute of value type <type>
        Given an attribute of value type <type> that applies to user groups exists
        And a user group exists
        And that user group has a value for the attribute
        And a user-manager edits that user group
        When the user-manager removes the value of the attribute
        And saves the user group
        Then the user group should be updated without a value for the new attribute

        Examples:
            | type |
            | TEXT |
            | LONG_TEXT |
            | BOOLEAN |
            | TRUE_ONLY |
            | DATE |
            | NUMBER |
            | INTEGER |
            | INTEGER_POSITIVE |
            | INTEGER_NEGATIVE |

    Scenario: Adding a value to an attribute with an option set
        Given an attribute with an option set that applies to user groups exists
        And a user group exists
        And that user group does not have a value for the attribute
        And a user-manager edits that user group
        When the user-manager selects a value for the attribute
        And saves the user group
        Then the user group should be updated with the new attribute value

    Scenario Outline: Changing the value of an attribute of value type <type>
        Given an attribute of value type <type> that applies to user groups exists
        And a user group exists
        And that user group has a value for the attribute
        And a user-manager edits that user group
        When the user-manager enters a different value for the attribute
        And saves the user group
        Then the user group should be updated with the new attribute value

    Scenario Outline: Removing the value of an attribute of value type <type>
        Given an attribute of value type <type> that applies to user groups exists
        And a user group exists
        And that user group has a value for the attribute
        And a user-manager edits that user group
        When the user-manager removes the value of the attribute
        And saves the user group
        Then the user group should be updated without a value for the new attribute
