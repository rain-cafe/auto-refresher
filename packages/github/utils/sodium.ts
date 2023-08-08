import sodium from 'libsodium-wrappers';

export async function getEncryptedValueForGitHub(publicKey: string, value: string): Promise<string> {
  await sodium.ready;

  // Encrypt the secret using libsodium
  const encBytes = sodium.crypto_box_seal(
    sodium.from_string(value),
    sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL)
  );

  return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
}
