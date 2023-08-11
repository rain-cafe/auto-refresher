import { KeyInfo, LogLevel, Logger, Refreshly, SourceModule, getEnv } from '../index';

describe('@refreshly/core', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockReturnValue(undefined);
    jest.spyOn(process, 'exit').mockReturnValue(undefined as never);
  });

  it('should export Logger and LogLevel', () => {
    expect(Logger).toBeDefined();
    expect(LogLevel).toBeDefined();
  });

  describe('func(Refreshly)', () => {
    class FakeModule extends SourceModule {
      get name(): string {
        return 'fake';
      }

      get originalKeyInfos(): KeyInfo[] {
        return [];
      }

      async source(): Promise<KeyInfo[]> {
        return [];
      }

      async cleanup() {}
      async revert() {}
    }

    it('should execute all of the source modules', async () => {
      const module = new FakeModule({
        targets: [],
      });

      jest.spyOn(module, 'exec').mockResolvedValue(undefined);

      await Refreshly(module);
    });

    it('should handle errors', async () => {
      const module = new FakeModule({
        targets: [],
      });

      jest.spyOn(module, 'exec').mockImplementation(async () => {
        throw new Error();
      });

      await Refreshly(module);

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('func(getEnv)', () => {
    it('should support config values', () => {
      expect(getEnv('hello', 'world')).toEqual('world');
    });

    it('should support env variables', () => {
      expect(getEnv('hello', null, 'NODE_ENV')).toEqual('test');
    });

    it('should throw an error if no value is provided', () => {
      expect(() => getEnv('key', null, 'AWS_ACCESS_KEY')).toThrow(
        `Expected "key" to be provided via... (config.key, AWS_ACCESS_KEY)`
      );
    });
  });
});
