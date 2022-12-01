import { FeatureFlagClient } from './FlagService';
import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';
import launchDarkly, { LDClient, LDOptions, LDUser } from 'launchdarkly-node-server-sdk';
const logger = Logger.getLogger('app');

export class LaunchDarkly implements FeatureFlagClient {
  private readonly client: LDClient;
  private readonly ldUser: LDUser;

  constructor(
    user: string = config.get('featureFlags.launchdarkly.ldUser'),
    sdkKey: string = config.get('featureFlags.launchdarkly.sdkKey')
  ) {
    this.ldUser = { key: user };

    let ldConfig: LDOptions = {};

    if (!sdkKey) {
      logger.warn('Missing LaunchDarkly SDK Key, using offline mode');
      ldConfig = { offline: true, logger: launchDarkly.basicLogger({ level: 'error' }) };
    }

    this.client = launchDarkly.init(sdkKey, ldConfig);
  }

  public async getFlagValue(flag: string): Promise<boolean | null> {
    await this.client.waitForInitialization();
    return this.client.variation(flag, this.ldUser, null);
  }

  public async getAllFlagValues(): Promise<{ [p: string]: boolean }> {
    await this.client.waitForInitialization();
    return (await this.client.allFlagsState(this.ldUser)).allValues();
  }
}
