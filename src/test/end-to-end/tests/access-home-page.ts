Feature('Home page');

Scenario('I should be able to access the home page', async ({ I }) => {
  I.amOnPage('/');
  I.see('Default page template');
}).tag('@CrossBrowser');

Scenario('I should be able to access the home page in Welsh', async ({ I }) => {
  I.amOnPage('/?lng=cy');
  I.see('Templed tudalen ddiofyn');
}).tag('@CrossBrowser');
