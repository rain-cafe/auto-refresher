import { KeyInfo, TargetModule, getEnv, PartiallyRequired } from '@refreshly/core';
import { createOrUpdateOrgSecrets } from './github/secrets';

export class GitHubTargetModule extends TargetModule {
  private options: PartiallyRequired<Omit<GitHubTargetModule.Options, keyof TargetModule.Options>, 'token'>;

  constructor({ prefix, token, ...options }: GitHubTargetModule.Options) {
    super({ prefix });

    this.options = {
      ...options,
      token: getEnv('token', token, 'GITHUB_TOKEN', 'GH_TOKEN'),
    };
  }

  get name(): string {
    return 'github';
  }

  async target(keyInfos: KeyInfo[]): Promise<void> {
    await createOrUpdateOrgSecrets({
      keyInfos,
      token: this.options.token,
      orgs: this.options.orgs,
    });
  }
}

export namespace GitHubTargetModule {
  export type Options = {
    token?: string;
    prefix?: string;
    orgs: string[];
  } & TargetModule.Options;
}
