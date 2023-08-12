import { keyInfoToKeyValue, keyValueToKeyInfo } from '../keyinfo';

describe('utils(KeyInfo)', () => {
  describe('func(keyInfoToKeyValue)', () => {
    it('should convert a KeyIfno object to a .env key-value ...', () => {
      expect(
        keyInfoToKeyValue({
          name: 'HELLO',
          value: 'WORLD',
        })
      ).toEqual('HELLO=WORLD');
    });
  });

  describe('func(keyValueToKeyInfo)', () => {
    it('should convert a .env key-value to a KeyInfo object', () => {
      expect(keyValueToKeyInfo('HELLO=WORLD')).toEqual({
        name: 'HELLO',
        value: 'WORLD',
      });
    });
  });
});
