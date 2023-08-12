import { chance } from '@refreshly/test-utils';
import { AWS } from '..';
import { AccessKey, createAwsAccessKey, deleteAwsAccessKey } from '../aws/access-keys';

jest.mock('../aws/access-keys');
const mockedDeleteAwsAccessKey = jest.mocked(deleteAwsAccessKey);
const mockedCreateAwsAccessKey = jest.mocked(createAwsAccessKey);

describe('source(AWS.Source)', () => {
  let updatedAccessKey: AccessKey;

  beforeEach(() => {
    updatedAccessKey = {
      key: chance.string(),
      secretKey: chance.string(),
    };

    mockedDeleteAwsAccessKey.mockResolvedValue();
    mockedCreateAwsAccessKey.mockResolvedValue(updatedAccessKey);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('should support reading tokens via options', () => {
      const expectedKey = chance.string();
      const expectedSecretKey = chance.string();

      const module = new AWS.Source({
        key: expectedKey,
        secretKey: expectedSecretKey,
        targets: [],
      });

      expect(module.originalKeyInfos).toEqual([
        {
          name: 'AWS_ACCESS_KEY_ID',
          value: expectedKey,
        },
        {
          name: 'AWS_SECRET_ACCESS_KEY',
          value: expectedSecretKey,
        },
      ]);
    });

    it('should support reading tokens via environment variables', () => {
      const expectedKey = chance.string();
      const expectedSecretKey = chance.string();

      process.env.AWS_ACCESS_KEY_ID = expectedKey;
      process.env.AWS_SECRET_ACCESS_KEY = expectedSecretKey;

      const module = new AWS.Source({
        targets: [],
      });

      expect(module.originalKeyInfos).toEqual([
        {
          name: 'AWS_ACCESS_KEY_ID',
          value: expectedKey,
        },
        {
          name: 'AWS_SECRET_ACCESS_KEY',
          value: expectedSecretKey,
        },
      ]);
    });
  });

  describe('get(name)', () => {
    it('should return the name', () => {
      const module = new AWS.Source({
        key: chance.string(),
        secretKey: chance.string(),
        targets: [],
      });

      expect(module.name).toEqual('aws');
    });
  });

  describe('get(originalKeyInfos)', () => {
    it('should return the name', () => {
      const expectedKey = chance.string();
      const expectedSecretKey = chance.string();

      const module = new AWS.Source({
        key: expectedKey,
        secretKey: expectedSecretKey,
        targets: [],
      });

      expect(module.originalKeyInfos).toEqual([
        {
          name: 'AWS_ACCESS_KEY_ID',
          value: expectedKey,
        },
        {
          name: 'AWS_SECRET_ACCESS_KEY',
          value: expectedSecretKey,
        },
      ]);
    });
  });

  describe('func(source)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should retrieve the new token', async () => {
      const expectedKey = chance.string();
      const expectedSecretKey = chance.string();

      const module = new AWS.Source({
        key: expectedKey,
        secretKey: expectedSecretKey,
        targets: [],
      });

      const [keyInfos] = await Promise.all([module.source(), jest.runAllTimersAsync()]);

      expect(keyInfos).toEqual([
        {
          name: 'AWS_ACCESS_KEY_ID',
          value: updatedAccessKey.key,
        },
        {
          name: 'AWS_SECRET_ACCESS_KEY',
          value: updatedAccessKey.secretKey,
        },
      ]);

      expect(createAwsAccessKey).toHaveBeenCalledWith({
        key: expectedKey,
        secretKey: expectedSecretKey,
      });
    });
  });

  describe('func(revert)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should delete the updated key if it exists', async () => {
      const module = new AWS.Source({
        key: chance.string(),
        secretKey: chance.string(),
        targets: [],
      });

      await Promise.all([module.source(), jest.runAllTimersAsync()]);

      expect(deleteAwsAccessKey).not.toHaveBeenCalled();

      await module.revert();

      expect(deleteAwsAccessKey).toHaveBeenCalledWith({
        key: updatedAccessKey.key,
        secretKey: updatedAccessKey.secretKey,
      });
    });

    it('should skip reverting if an updated key is not defined', async () => {
      const module = new AWS.Source({
        key: chance.string(),
        secretKey: chance.string(),
        targets: [],
      });

      expect(deleteAwsAccessKey).not.toHaveBeenCalled();

      await module.revert();

      expect(deleteAwsAccessKey).not.toHaveBeenCalled();
    });
  });

  describe('cleanup(revert)', () => {
    it('should delete the old key', async () => {
      const expectedKey = chance.string();
      const expectedSecretKey = chance.string();

      const module = new AWS.Source({
        key: expectedKey,
        secretKey: expectedSecretKey,
        targets: [],
      });

      await module.cleanup();

      expect(deleteAwsAccessKey).toHaveBeenCalledWith({
        key: expectedKey,
        secretKey: expectedSecretKey,
      });
    });
  });
});
