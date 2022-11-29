Feature('Error page');

Scenario('I should be shown a 404/not found page when not accessing content correctly', async ({ I }) => {
  I.amOnPage('/someUnknownPage');
  I.see('Page Not Found');
}).tag('@CrossBrowser');
