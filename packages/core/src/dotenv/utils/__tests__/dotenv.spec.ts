import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { write, read, readSync, merge } from '../dotenv';

describe('utils(DotEnv)', () => {
  const file = path.join(__dirname, '.env');

  afterEach(async () => {
    await fs.unlink(file);
  });

  describe('func(write)', () => {
    it('should write a corresponding .env file', async () => {
      await write(file, [
        {
          name: 'HELLO',
          value: 'WORLD',
        },
        {
          name: 'HALLO',
          value: 'WELT',
        },
      ]);

      const content = await fs.readFile(file, {
        encoding: 'utf-8',
      });

      expect(content).toEqual(['HELLO=WORLD', 'HALLO=WELT'].join('\n'));
    });
  });

  describe('func(read)', () => {
    beforeEach(async () => {
      await write(file, [
        {
          name: 'HELLO',
          value: 'WORLD',
        },
        {
          name: 'HALLO',
          value: 'WELT',
        },
      ]);
    });

    it('should read the corresponding .env file', async () => {
      const content = await read(file);

      expect(content).toEqual([
        {
          name: 'HELLO',
          value: 'WORLD',
        },
        {
          name: 'HALLO',
          value: 'WELT',
        },
      ]);
    });

    it('should support filtering out properties', async () => {
      const content = await read(file, ['HELLO']);

      expect(content).toEqual([
        {
          name: 'HELLO',
          value: 'WORLD',
        },
      ]);
    });

    it('should support files that do not exist', async () => {
      const content = await read('.env.not-real');

      expect(content).toEqual([]);
    });
  });

  describe('func(readSync)', () => {
    beforeEach(async () => {
      await write(file, [
        {
          name: 'HELLO',
          value: 'WORLD',
        },
        {
          name: 'HALLO',
          value: 'WELT',
        },
      ]);
    });

    it('should read the corresponding .env file', () => {
      const content = readSync(file);

      expect(content).toEqual([
        {
          name: 'HELLO',
          value: 'WORLD',
        },
        {
          name: 'HALLO',
          value: 'WELT',
        },
      ]);
    });

    it('should support filtering out properties', () => {
      const content = readSync(file, ['HELLO']);

      expect(content).toEqual([
        {
          name: 'HELLO',
          value: 'WORLD',
        },
      ]);
    });

    it('should support files that do not exist', () => {
      const content = readSync('.env.not-real');

      expect(content).toEqual([]);
    });
  });

  describe('func(merge)', () => {
    beforeEach(async () => {
      await write(file, [
        {
          name: 'HELLO',
          value: 'WORLD',
        },
        {
          name: 'HALLO',
          value: 'WELT',
        },
      ]);
    });

    it('should merge the new KeyInfos with the existing properties', async () => {
      await merge(file, [
        {
          name: 'HELLO',
          value: 'WELT',
        },
      ]);

      const content = await fs.readFile(file, {
        encoding: 'utf-8',
      });

      expect(content).toEqual(['HELLO=WELT', 'HALLO=WELT'].join('\n'));
    });
  });
});
