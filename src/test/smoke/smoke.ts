import { constants as httpConstants } from 'http2';

import axios from 'axios';
import config from 'config';

import { config as testConfig } from '../config';

const servicesToCheck = [
  { name: 'idam-hmcts-access', url: testConfig.TEST_URL },
  { name: 'idam-api', url: config.get('services.idam.url.api') },
];

describe('Smoke Test', () => {
  describe('Health Check', () => {
    describe.each(servicesToCheck)('Required services should return 200 status UP', ({ name, url }) => {
      const parsedUrl = new URL('/health', url as string).toString();

      test(`${name}: ${parsedUrl}`, async () => {
        const checkService = async () => {
          try {
            const response = await axios.get(parsedUrl);

            if (response.status !== httpConstants.HTTP_STATUS_OK || response.data?.status !== 'UP') {
              throw new Error(`Status: ${response.status} Data: '${JSON.stringify(response.data)}'`);
            }
          } catch (e) {
            await new Promise((resolve, reject) =>
              setTimeout(() => reject(`'${name}' endpoint is not up: '${parsedUrl}': ${e}`), 1000)
            );
          }
        };

        await expect(checkService()).resolves.not.toThrow();
      });
    });
  });
});
