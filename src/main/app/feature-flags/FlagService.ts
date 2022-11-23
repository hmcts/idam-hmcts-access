import { constants as http } from 'http2';
import { HTTPError } from '../../HttpError';
import config from 'config';
import { NextFunction, Request, Response } from 'express';

export class FlagService {
  constructor(
    private flagClient: FeatureFlagClient,
    private flagOverrides: { [key: string]: boolean } = config.get('featureFlags.flags')
  ) {}

  public getFlagValue = (flagKey: string, defaultValue = false): Promise<boolean> => {
    return this.flagOverrides.hasOwnProperty(flagKey)
      ? Promise.resolve(this.flagOverrides[flagKey])
      : this.flagClient.getFlagValue(flagKey, defaultValue);
  };

  public getAllFlagValues = (defaultValue = false): Promise<{ [key: string]: boolean }> => {
    return this.flagClient.getAllFlagValues(defaultValue).then(values => ({
      ...values,
      ...this.flagOverrides,
    }));
  };

  public toggleRoute = (flagKey: string, defaultValue = false) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      this.getFlagValue(flagKey, defaultValue)
        .then(result => (result ? next() : next('route')))
        .catch(() => next(new HTTPError(http.HTTP_STATUS_INTERNAL_SERVER_ERROR)));
    };
  };
}

export interface FeatureFlagClient {
  getFlagValue: (flag: string, defaultValue: boolean) => Promise<boolean>;
  getAllFlagValues: (defaultValue: boolean) => Promise<{ [flag: string]: boolean }>;
  onFlagChange: (callback: Function, defaultValue: boolean, flag?: string) => void;
}
