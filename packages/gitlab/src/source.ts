import { KeyInfo, PartiallyRequired, SourceModule, getEnv } from '@refreshly/core';
import { rotatePersonalAccessToken } from './gitlab/personal-access-token';

export class GitLabSourceModule extends SourceModule {
  private options: PartiallyRequired<Omit<GitLabSourceModule.Options, keyof SourceModule.Options>, 'token'>;
  private token?: string;

  constructor({ token, targets, ...options }: GitLabSourceModule.Options) {
    super({ targets });

    this.options = {
      ...options,
      token: getEnv('token', token, 'GITLAB_TOKEN', 'GL_TOKEN'),
    };
  }

  get name(): string {
    return 'gitlab';
  }

  get originalKeyInfos(): KeyInfo[] {
    return [
      {
        name: 'GITLAB_TOKEN',
        value: this.options.token,
      },
    ];
  }

  async source(): Promise<KeyInfo[]> {
    this.token = await rotatePersonalAccessToken({
      token: this.options.token,
    });

    /*
     * GitLab doesn't *really* support deferring the deletion of the old token.
     * This results in a few issues...
     *
     * 1. We can't revert to the old token if a failure occurs
     * 2. We have to update the environment variable so that 'Gitlab.Target' can pick it up.
     *
     * As an aside, GitLab DOES have a create token endpoint, however its only usable by server admins making it effectively useless
     * https://docs.gitlab.com/ee/api/personal_access_tokens.html#create-a-personal-access-token-administrator-only
     */
    process.env.GITLAB_TOKEN = this.token;

    return [
      {
        name: 'GITLAB_TOKEN',
        value: this.token,
      },
    ];
  }

  async revert(): Promise<void> {
    throw new Error(`(${this.name}) Recovery isn't possible, please manually create a new token...`);
  }
}

export namespace GitLabSourceModule {
  export type Options = {
    token?: string;
  } & SourceModule.Options;
}
