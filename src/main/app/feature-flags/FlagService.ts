import { constants as http } from 'http2';
import { HTTPError } from '../../HttpError';
import config from 'config';
import { NextFunction, Request, Response } from 'express';

export class FlagService {
  constructor(
    private flagClient: FeatureFlagClient,
    private flagOverrides: { [key: string]: boolean } = config.get('featureFlags.flags') || {}
  ) {}

  public getFlagValue = async (flagKey: string, defaultValue = false): Promise<boolean> => {
    const flagFromClient = await this.flagClient.getFlagValue(flagKey);
    const flagFromOverride = this.flagOverrides[flagKey];

    if (typeof flagFromClient === 'boolean') {
      return flagFromClient;
    }

    if (typeof flagFromOverride === 'boolean') {
      return flagFromOverride;
    }

    return defaultValue;
  };

  public getAllFlagValues = (): Promise<{ [key: string]: boolean }> => {
    return this.flagClient.getAllFlagValues()
      .then(values => ({
        ...values,
        ...this.flagOverrides,
      }));
  };

  public toggleRoute = (flagKey: string, defaultValue = false) => {
    return (req: Request, res: Response, next: NextFunction): Promise<void> => {
      return this.getFlagValue(flagKey, defaultValue)
        .then(result => (result ? next() : next('route')))
        .catch(() => next(new HTTPError(http.HTTP_STATUS_INTERNAL_SERVER_ERROR)));
    };
  };
}

export interface FeatureFlagClient {
  getFlagValue: (flag: string) => Promise<boolean | null>;
  getAllFlagValues: () => Promise<{ [flag: string]: boolean }>;
}
