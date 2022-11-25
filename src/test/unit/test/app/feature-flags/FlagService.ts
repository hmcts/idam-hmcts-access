import { FeatureFlagClient, FlagService } from '../../../../../main/app/feature-flags/FlagService';
import { mockRequest } from '../../../mocks/mockRequest';
import { mockResponse } from '../../../mocks/mockResponse';
import config from 'config';
import { when } from 'jest-when';

jest.mock('config');

describe('FlagService', () => {
  const mockFeatureFlagClient: FeatureFlagClient = {
    getFlagValue: jest.fn(),
    getAllFlagValues: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Should return flag value', async () => {
    when(mockFeatureFlagClient.getFlagValue).calledWith('test-feature-flag').mockReturnValue(Promise.resolve(true));

    const featureFlags = new FlagService(mockFeatureFlagClient);
    const testResult = await featureFlags.getFlagValue('test-feature-flag');

    expect(mockFeatureFlagClient.getFlagValue).toHaveBeenCalled();
    expect(testResult).toBe(true);
  });

  test('Should return overridden flag value', async () => {
    when(config.get).calledWith('featureFlags.flags').mockReturnValue({ 'test-feature-flag': false });

    const featureFlags = new FlagService(mockFeatureFlagClient);
    const testResult = await featureFlags.getFlagValue('test-feature-flag');

    expect(testResult).toBe(false);
  });

  test('Should return default flag value', async () => {
    const featureFlags = new FlagService(mockFeatureFlagClient);
    const testResult = await featureFlags.getFlagValue('test-feature-flag', true);

    expect(testResult).toBe(true);
  });

  test('Should return all flag values', async () => {
    const mockData = {
      'test-feature-flag-1': true,
      'test-feature-flag-2': false,
      'test-feature-flag-3': false,
    };

    when(mockFeatureFlagClient.getAllFlagValues).mockReturnValue(Promise.resolve(mockData));

    const featureFlags = new FlagService(mockFeatureFlagClient);
    const testResult = await featureFlags.getAllFlagValues();

    expect(mockFeatureFlagClient.getAllFlagValues).toHaveBeenCalled();
    expect(testResult).toStrictEqual(mockData);
  });

  test('Should return all flag with overridden flag values', async () => {
    const mockData = {
      'test-feature-flag-1': true,
      'test-feature-flag-2': false,
      'test-feature-flag-3': false,
    };

    const expectedData = {
      'test-feature-flag-1': true,
      'test-feature-flag-2': true,
      'test-feature-flag-3': false,
    };

    when(mockFeatureFlagClient.getAllFlagValues).mockReturnValue(Promise.resolve(mockData));
    when(config.get).calledWith('featureFlags.flags').mockReturnValue({ 'test-feature-flag-2': true });

    const featureFlags = new FlagService(mockFeatureFlagClient);
    const testResult = await featureFlags.getAllFlagValues();

    expect(mockFeatureFlagClient.getAllFlagValues).toHaveBeenCalled();
    expect(testResult).toStrictEqual(expectedData);
  });

  test('Should use feature-flag controller if flag is true', async () => {
    const mockReq = mockRequest();
    const mockRes = mockResponse();
    const mockNextController = jest.fn();

    when(mockFeatureFlagClient.getFlagValue).calledWith('test-feature-flag').mockReturnValue(Promise.resolve(true));

    const featureFlags = new FlagService(mockFeatureFlagClient);
    await featureFlags.toggleRoute('test-feature-flag')(mockReq, mockRes, mockNextController);

    expect(mockFeatureFlagClient.getFlagValue).toHaveBeenCalledWith('test-feature-flag');
    expect(mockNextController).toHaveBeenCalled();
  });

  test('Should send to next route if flag is false', async () => {
    const mockReq = mockRequest();
    const mockRes = mockResponse();
    const mockNextController = jest.fn();

    when(mockFeatureFlagClient.getFlagValue).calledWith('test-feature-flag').mockReturnValue(Promise.resolve(false));

    const featureFlags = new FlagService(mockFeatureFlagClient);
    await featureFlags.toggleRoute('test-feature-flag')(mockReq, mockRes, mockNextController);

    expect(mockFeatureFlagClient.getFlagValue).toHaveBeenCalledWith('test-feature-flag');
    expect(mockNextController).toHaveBeenCalledWith('route');
  });
});
