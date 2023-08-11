import { Octokit } from 'octokit';
import { getEncryptedValueForGitHub } from '../utils/sodium';
import { KeyInfo } from '@refreshly/core';

export type BaseRequest = {
  token: string;
  orgs: string[];
};

export type SecretsRequest = BaseRequest & {
  keyInfos: KeyInfo[];
};

export type PublicKey = {
  org: string;
  keyId: string;
  key: string;
};

export async function getOrgPublicKeys({ token, orgs }: BaseRequest): Promise<PublicKey[]> {
  const octokit = new Octokit({
    auth: token,
  });

  await octokit.rest.users.getAuthenticated();

  return Promise.all(
    orgs.map(async (org) => {
      const { data } = await octokit.rest.actions.getOrgPublicKey({
        org,
      });

      return {
        org,
        keyId: data.key_id,
        key: data.key,
      };
    })
  );
}

export async function createOrUpdateOrgSecrets({ token, orgs, keyInfos }: SecretsRequest): Promise<void> {
  const octokit = new Octokit({
    auth: token,
  });

  await octokit.rest.users.getAuthenticated();

  const publicKeys = await getOrgPublicKeys({
    token,
    orgs,
  });

  await Promise.all(
    publicKeys.map(async ({ keyId, key, org }) => {
      await Promise.all(
        keyInfos.map(async (keyInfo) => {
          await octokit.rest.actions.createOrUpdateOrgSecret({
            org,
            key_id: keyId,
            secret_name: keyInfo.name,
            visibility: 'all',
            encrypted_value: await getEncryptedValueForGitHub(key, keyInfo.value),
          });
        })
      );
    })
  );
}
