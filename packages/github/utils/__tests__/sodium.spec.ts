import { getEncryptedValueForGitHub } from '../sodium';
import sodium from 'libsodium-wrappers';

describe('@refreshly/github', () => {
  describe('func(getEncryptedValueForGitHub)', () => {
    it('should encrypt the value for github', async () => {
      await sodium.ready;

      const keypair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keypair.publicKey, sodium.base64_variants.ORIGINAL);

      const encryptedValue = await getEncryptedValueForGitHub(publicKey, 'hello-world');

      expect(encryptedValue).toBeDefined();

      const decryptedValue = sodium.crypto_box_seal_open(
        sodium.from_base64(encryptedValue, sodium.base64_variants.ORIGINAL),
        keypair.publicKey,
        keypair.privateKey
      );

      expect(sodium.to_string(decryptedValue)).toEqual('hello-world');
    });
  });
});
