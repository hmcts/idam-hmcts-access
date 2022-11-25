import { LaunchDarkly } from '../../../../../main/app/feature-flags/LaunchDarklyClient';
import { when } from 'jest-when';
import launchdarkly from 'launchdarkly-node-server-sdk';

jest.mock('config');
jest.mock('launchdarkly-node-server-sdk');

describe('LaunchDarklyClient', () => {
  const client = {
    waitForInitialization: jest.fn().mockReturnValue(Promise.resolve()),
    variation: jest.fn().mockReturnValue(Promise.resolve()),
    allFlagsState: jest.fn().mockResolvedValue({
      allValues: jest.fn()
    })
  };
  const key = 'USER-KEY';
  when(launchdarkly.init).mockReturnValue(client as never);

  describe('constructor', () => {
    test('No SDK key', () => {
      const config = { 'logger': undefined, 'offline': true };

      new LaunchDarkly();
      expect(launchdarkly.init).toHaveBeenCalledWith(undefined, config);
    });

    test('SDK key', () => {
      const sdkKey = '1234';
      const config = {};

      new LaunchDarkly(key, sdkKey);
      expect(launchdarkly.init).toHaveBeenCalledWith(sdkKey, config);
    });
  });

  test('getFlagValue', async () => {
    const flag = 'test-feature-flag';
    const launchDarklyClient = new LaunchDarkly(key);

    await launchDarklyClient.getFlagValue(flag);
    expect(client.waitForInitialization).toHaveBeenCalled();
    expect(client.variation).toHaveBeenCalledWith(flag, { key }, null);
  });

  test('getAllFlagValues', async () => {
    const launchDarklyClient = new LaunchDarkly(key);

    await launchDarklyClient.getAllFlagValues();
    expect(client.waitForInitialization).toHaveBeenCalled();
    expect(client.allFlagsState).toHaveBeenCalledWith({ key });
  });
});
