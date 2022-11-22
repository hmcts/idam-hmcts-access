Feature: Initial Functional test

    @nightly
    Scenario: This is a blank nighty test
        When I go to '/'
        Then the page should include 'Default page template'
