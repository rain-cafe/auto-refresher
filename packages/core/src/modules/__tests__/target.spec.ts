import { TargetModule } from '..';

describe('TargetModule', () => {
  describe('func(prefix)', () => {
    class FakeModule extends TargetModule {
      get name(): string {
        throw new Error('Method not implemented.');
      }

      target(): Promise<void> {
        throw new Error('Method not implemented.');
      }
    }

    it('should apply the prefix', () => {
      const module = new FakeModule({
        prefix: 'CI_ONLY_',
      });

      expect(
        module.prefix([
          {
            name: 'HELLO',
            value: 'WORLD',
          },
        ])
      ).toEqual([
        {
          name: 'CI_ONLY_HELLO',
          value: 'WORLD',
        },
      ]);
    });

    it('should return the original KeyInfos if no prefix is defined', () => {
      const module = new FakeModule({});

      expect(
        module.prefix([
          {
            name: 'HELLO',
            value: 'WORLD',
          },
        ])
      ).toEqual([
        {
          name: 'HELLO',
          value: 'WORLD',
        },
      ]);
    });
  });
});
