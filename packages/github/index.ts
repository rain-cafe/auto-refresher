import { Octokit } from 'octokit';
import * as sodium from 'libsodium-wrappers';
import { KeyInfo, ITargetModule, getEnv } from '@refreshly/core';

class GitHubTargetModule implements ITargetModule {
  #options: GitHubTargetModule.Options;
  #octokit: Octokit;
  #publicKey: Promise<{
    key_id: string;
    key: string;
  }>;

  constructor({ token, ...options }: GitHubTargetModule.Options) {
    this.#options = {
      ...options,
      token: getEnv('token', token, 'GITHUB_TOKEN', 'GH_TOKEN'),
    };

    this.#octokit = new Octokit({
      auth: this.#options.token,
    });

    // Run this in the background to try to ensure its cached by the time we need it
    this.#getOrgPublicKey(this.#options.org);
  }

  async #getOrgPublicKey(org: string): Promise<{ key_id: string; key: string }> {
    if (!this.#publicKey) {
      this.#publicKey = this.#octokit.rest.users.getAuthenticated().then(async () => {
        const { data } = await this.#octokit.rest.actions.getOrgPublicKey({
          org,
        });

        return {
          key_id: data.key_id,
          key: data.key,
        };
      });
    }

    return this.#publicKey;
  }

  async #update(keyInfos: KeyInfo[]): Promise<void> {
    await this.#octokit.rest.users.getAuthenticated();

    const [{ key, key_id }] = await Promise.all([this.#getOrgPublicKey(this.#options.org), sodium.ready]);

    await Promise.all(
      keyInfos.map(async (keyInfo) => {
        // Encrypt the secret using libsodium
        const encBytes = sodium.crypto_box_seal(
          sodium.from_string(keyInfo.value),
          sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
        );

        await this.#octokit.rest.actions.createOrUpdateOrgSecret({
          key_id,
          org: this.#options.org,
          secret_name: keyInfo.name,
          visibility: 'all',
          encrypted_value: sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL),
        });
      })
    );
  }

  revert = this.#update;
  target = this.#update;
}

namespace GitHubTargetModule {
  export interface Options {
    token?: string;
    org: string;
  }
}

export const GitHub = {
  Target: GitHubTargetModule,
};
