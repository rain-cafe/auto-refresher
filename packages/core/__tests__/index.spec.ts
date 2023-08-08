import { KeyInfo, Refreshly, SourceModule, getEnv, prefix } from '../index';

describe('@refreshly/core', () => {
  describe('func(Refreshly)', () => {
    it('should ...', async () => {
      class FakeModule extends SourceModule {
        get originalKeyInfos(): KeyInfo[] {
          return [];
        }

        async source() {
          return [];
        }

        async cleanup() {}
        async revert() {}
      }

      const module = new FakeModule({
        targets: [],
      });

      await Refreshly(module);
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

  describe('func(prefix)', () => {
    it('should support concatinating values', () => {
      expect(prefix('hello', 'world')).toEqual('helloworld');
    });

    it('should support falsy values', () => {
      expect(prefix(null, 'world')).toEqual('world');
    });
  });
});
