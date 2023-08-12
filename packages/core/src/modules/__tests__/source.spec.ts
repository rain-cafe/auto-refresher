import { SourceModule } from '..';
import { KeyInfo } from '../..';

describe('SourceModule', () => {
  describe('func(prefix)', () => {
    class FakeModule extends SourceModule {
      get name(): string {
        throw new Error('Method not implemented.');
      }

      get originalKeyInfos(): KeyInfo[] {
        throw new Error('Method not implemented.');
      }

      source(): Promise<KeyInfo[]> {
        throw new Error('Method not implemented.');
      }
    }

    it('should apply the prefix', async () => {
      const module = new FakeModule({
        prefix: 'CI_ONLY_',
        targets: [],
      });

      const keyInfos: Promise<KeyInfo[]> = Promise.resolve([
        {
          name: 'HELLO',
          value: 'WORLD',
        },
      ]);

      await expect(module.prefix(keyInfos)).resolves.toEqual([
        {
          name: 'CI_ONLY_HELLO',
          value: 'WORLD',
        },
      ]);
    });

    it('should return the original KeyInfos if no prefix is defined', async () => {
      const module = new FakeModule({
        targets: [],
      });
      const keyInfos: Promise<KeyInfo[]> = Promise.resolve([
        {
          name: 'HELLO',
          value: 'WORLD',
        },
      ]);

      await expect(module.prefix(keyInfos)).resolves.toEqual([
        {
          name: 'HELLO',
          value: 'WORLD',
        },
      ]);
    });
  });
});
