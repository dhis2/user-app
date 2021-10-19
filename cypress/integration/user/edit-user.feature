Feature: A user can be edited

    # input fields
    Scenario Outline: A <input> is added to an account
        Given a user without <input> exists
        And the user-manager is editing that user
        When the user-manager enters a new value into the <input> field
        And the user-manager submits the form
        Then the user should be saved with the new value

        Examples:
            | input |
            | email |
            | password |
            | openId |
            | ldapId |
            | phoneNumber |
            | whatsApp |
            | facebookMessenger |
            | skype |
            | telegram |
            | twitter |

    # input fields
    Scenario Outline: A <input> is edited on an account
        Given a user without <input> exists
        And the user-manager is editing that user
        When the user-manager enters a new value into the <input> field
        And the user-manager submits the form
        Then the user should be saved with the new value

        Examples:
            | input |
            | email |
            | password |
            | surname |
            | firstName |
            | openId |
            | ldapId |
            | phoneNumber |
            | whatsApp |
            | facebookMessenger |
            | skype |
            | telegram |
            | twitter |

    # single select inputs
    Scenario Outline: A <option> is chosen for an account
        Given a user exists
        And the user-manager is editing that user
        When the user-manager selects a different option for the <option> field
        And the user-manager submits the form
        Then the user should be saved with the new option

        Examples:
            | option |
            | interfaceLanguage |
            | databaseLanguage |

    # Multiselect, Transfer & org unit tree inputs
    Scenario Outline: An additional <option> is added to an account
        Given a user exists
        And the user-manager is editing that user
        When the user-manager adds a new value to the <option> field
        And the user-manager submits the form
        Then the user should be saved with the additional option

        Examples:
            | option |
            | availableRoles |
            | dataCaptureAndMaintenanceOrgUnits |
            | dataOutputAndAnalyticOrgUnits |
            | orgUnits |
            | userGroups |
            | dimensionRestrictionsForDataAnalytics |

    # Multiselect, Transfer & org unit tree inputs
    # Removing a selection when multiple selections are present
    # Should work with both required and optional fields
    Scenario Outline: An additional <option> is removed from an account
        Given a user exists with multiple values in the <option> field
        And the user-manager is editing that user
        When the user-manager removes an additional value from the <option> field
        And the user-manager submits the form
        Then the user should be saved without the removed value

        Examples:
            | option |
            | availableRoles |
            | dataCaptureAndMaintenanceOrgUnits |
            | dataOutputAndAnalyticOrgUnits |
            | orgUnits |
            | userGroups |
            | dimensionRestrictionsForDataAnalytics |

    # Multiselect, Transfer & org unit tree inputs
    # Removing the only selection
    # Should work with optional fields
    Scenario Outline: The last selection of <option> is removed from an account
        Given a user exists with a single value in the <option> field
        And the user-manager is editing that user
        When the user-manager removes the last value from the <option> field
        And the user-manager submits the form
        Then the user should be saved without the removed value

        Examples:
            | option |
            | dataOutputAndAnalyticOrgUnits |
            | orgUnits |
            | userGroups |
            | dimensionRestrictionsForDataAnalytics |

    # Multiselect, Transfer & org unit tree inputs
    # Removing the only selection
    # Should not work with required fields
    Scenario Outline: The last selection of <option> is removed from an account is prevented
        Given a user exists with a single value in the <option> field
        And the user-manager is editing that user
        When the user-manager removes the last value from the <option> field
        Then the user should be able to submit the form

        Examples:
            | option |
            | dataOutputAndAnalyticOrgUnits |
            | orgUnits |
            | userGroups |
            | dimensionRestrictionsForDataAnalytics |
