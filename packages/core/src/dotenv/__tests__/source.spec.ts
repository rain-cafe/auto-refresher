import { DotEnv } from '..';
import { read, readSync } from '../utils/dotenv';
import path from 'path';

jest.mock('../utils/dotenv');
const readMocked = jest.mocked(read);
const readSyncMocked = jest.mocked(readSync);

describe('source(DotEnv.Source)', () => {
  beforeEach(() => {
    readMocked.mockResolvedValue([]);
    readSyncMocked.mockReturnValue([]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('should support relative paths', () => {
      const expectedFile = '.env';

      new DotEnv.Source({
        file: expectedFile,
        targets: [],
      });

      expect(readSyncMocked).toHaveBeenCalledWith(path.join(process.cwd(), expectedFile), undefined);
    });

    it('should support absolute paths', () => {
      const expectedFile = path.join(process.cwd(), 'packages/.env');

      new DotEnv.Source({
        file: expectedFile,
        targets: [],
      });

      expect(readSyncMocked).toHaveBeenCalledWith(expectedFile, undefined);
    });
  });

  describe('get(name)', () => {
    it('should return the name', () => {
      const module = new DotEnv.Source({
        file: '.env',
        targets: [],
      });

      expect(module.name).toEqual('dotenv');
    });
  });

  describe('get(originalKeyInfos)', () => {
    it('should return the name', () => {
      const module = new DotEnv.Source({
        file: '.env',
        targets: [],
      });

      expect(module.originalKeyInfos).toEqual([]);
    });
  });

  describe('func(source)', () => {
    it('should return the name', async () => {
      const module = new DotEnv.Source({
        file: '.env',
        targets: [],
      });

      await expect(module.source()).resolves.toEqual([]);
    });
  });
});
