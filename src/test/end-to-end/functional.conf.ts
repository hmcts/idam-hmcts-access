import path from 'path';
import { config as testConfig } from '../config';

const { setHeadlessWhen } = require('@codeceptjs/configure');

setHeadlessWhen(testConfig.TestHeadlessBrowser);

export const config: CodeceptJS.MainConfig = {
  name: 'functional',
  tests: './features/**/*.js',
  output: path.join(testConfig.TestFunctionalOutputPath, 'functional/reports'),
  gherkin: testConfig.Gherkin,
  helpers: testConfig.helpers,
  plugins: {
    ...testConfig.plugins,
    pauseOnFail: {
      enabled: !testConfig.TestHeadlessBrowser,
    },
  },
};
