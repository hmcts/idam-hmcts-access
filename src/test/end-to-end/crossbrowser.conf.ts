import * as path from 'path';
import { config as testConfig } from '../config';
import {event, container} from 'codeceptjs';

export const config: CodeceptJS.MainConfig = {
  name: 'cross-browser',
  tests: './features/**/*.js',
  output: path.join(testConfig.TestFunctionalOutputPath, 'cross-browser/reports'),
  gherkin: testConfig.Gherkin,
  helpers: testConfig.helpers,
  plugins: testConfig.plugins,
  multiple: {
    chromium: { browsers: [{ browser: 'chromium' } ] },
    webkit: { browsers: [{ browser: 'webkit' } ] },
    firefox: { browsers: [{ browser: 'firefox' } ] },
  },
};

event.dispatcher.on(event.test.after, () => {
  const browser = container.helpers().Playwright.browser._initializer;
  const { allure } = container.plugins();
  allure.epic(browser.name);
  allure.addParameter('environment', 'Browser', browser.name);
  allure.addParameter('environment', 'Version', browser.version);
});
