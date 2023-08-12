import { DotEnv } from '..';
import { KeyInfo } from '../..';
import { merge } from '../utils/dotenv';
import path from 'path';

jest.mock('../utils/dotenv');
const mergeMocked = jest.mocked(merge);

describe('target(DotEnv.Target)', () => {
  beforeEach(() => {
    mergeMocked.mockResolvedValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('get(name)', () => {
    it('should return the name', () => {
      const module = new DotEnv.Target({
        file: '.env',
      });

      expect(module.name).toEqual('dotenv');
    });
  });

  describe('func(target)', () => {
    it('should support relative paths', async () => {
      const expectedFile = '.env';
      const expectedKeyInfos: KeyInfo[] = [
        {
          name: 'HELLO',
          value: 'WORLD',
        },
      ];

      const module = new DotEnv.Target({
        file: expectedFile,
      });

      await module.target(expectedKeyInfos);

      expect(mergeMocked).toHaveBeenCalledWith(path.join(process.cwd(), expectedFile), expectedKeyInfos);
    });

    it('should support absolute paths', async () => {
      const expectedFile = path.join(process.cwd(), '.env');
      const expectedKeyInfos: KeyInfo[] = [
        {
          name: 'HELLO',
          value: 'WORLD',
        },
      ];

      const module = new DotEnv.Target({
        file: expectedFile,
      });

      await module.target(expectedKeyInfos);

      expect(mergeMocked).toHaveBeenCalledWith(expectedFile, expectedKeyInfos);
    });
  });
});
