import * as path from 'path';
import { config as testConfig } from '../config';

export const config: CodeceptJS.MainConfig = {
  name: 'cross-browser',
  tests: './features/**/*.js',
  output: path.join(testConfig.TestFunctionalOutputPath, 'cross-browser/reports'),
  gherkin: testConfig.Gherkin,
  helpers: testConfig.helpers,
  plugins: testConfig.plugins,
  multiple: {
    crossBrowser: {
      browsers: [{ browser: 'chromium' }, { browser: 'webkit' }, { browser: 'firefox' }],
    },
  },
};
