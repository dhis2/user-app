Feature: The app has a main navigation

    Scenario: No link is active
        Given the user is on the homepage
        Then no link in the main navigation should be active

    Scenario: The user navigates to the users page
        Given the user is on the homepage
        When the user clicks the users link in the main navigation
        Then the user should be redirected to the user list page

    Scenario: The user navigates to the user groups page
        Given the user is on the homepage
        When the user clicks the user groups link in the main navigation
        Then the user should be redirected to the user group list page

    Scenario: The user navigates to the user roles page
        Given the user is on the homepage
        When the user clicks the user roles link in the main navigation
        Then the user should be redirected to the user role list page

    Scenario: The users link is active
        Given the user is on the user list page
        Then the users link in the main navigation should be active

    Scenario: The user groups link is active
        Given the user is on the user group list page
        Then the user groups link in the main navigation should be active

    Scenario: The user roles link is active
        Given the user is on the user role list page
        Then the user roles link in the main navigation should be active
