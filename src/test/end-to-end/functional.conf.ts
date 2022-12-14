import path from 'path';
import { config as testConfig } from '../config';

const { setHeadlessWhen } = require('@codeceptjs/configure');

setHeadlessWhen(testConfig.TestHeadlessBrowser);

export const config: CodeceptJS.MainConfig = {
  name: 'functional',
  tests: './tests/*.ts',
  output: path.join(testConfig.TestFunctionalOutputPath, 'functional/reports'),
  helpers: testConfig.helpers,
  plugins: {
    ...testConfig.plugins,
    pauseOnFail: {
      enabled: !testConfig.TestHeadlessBrowser,
    },
  },
};
