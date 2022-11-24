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

    const ldConfig: LDOptions = {
      diagnosticOptOut: true,
    };

    if (!sdkKey) {
      logger.warn('Missing LaunchDarkly SDK Key, using offline mode');
      ldConfig.offline = true;
      ldConfig.logger = launchDarkly.basicLogger({
        level: 'error',
      });
    }

    this.client = launchDarkly.init(sdkKey, ldConfig);
  }

  public async getFlagValue(flag: string, defaultValue: boolean): Promise<boolean> {
    await this.client.waitForInitialization();
    return this.client.variation(flag, this.ldUser, defaultValue);
  }

  public async getAllFlagValues(defaultValue: boolean): Promise<{ [p: string]: boolean }> {
    await this.client.waitForInitialization();
    const flagMap = (await this.client.allFlagsState(this.ldUser)).allValues();
    for (const key in flagMap) {
      flagMap[key] = flagMap[key] ?? defaultValue;
    }

    return flagMap;
  }

  public onFlagChange(callback: Function, defaultValue: boolean, flag?: string): void {
    if (flag) {
      this.client.on(`update:${flag}`, async () => callback(await this.getFlagValue(flag, defaultValue)));
    } else {
      this.client.on('update', async () => callback(await this.getAllFlagValues(defaultValue)));
    }
  }

  public closeConnection(): void {
    this.client.close();
  }
}
