import { KeyInfo, Logger, PartiallyRequired, SourceModule, getEnv, prefix } from '@refreshly/core';
import { Gitlab } from '@gitbeaker/rest';
import { Gitlab as GitlabCore, PersonalAccessTokenSchema } from '@gitbeaker/core';

type RotatedPersonalAccessTokenSchema = PersonalAccessTokenSchema & { token: string };

export class GitLabSourceModule extends SourceModule {
  protected declare options: PartiallyRequired<GitLabSourceModule.Options, 'token'>;
  private client: GitlabCore<false>;
  private token?: RotatedPersonalAccessTokenSchema;

  constructor({ token, targets, ...options }: GitLabSourceModule.Options) {
    super({
      targets,
    });

    this.options = {
      ...this.options,
      ...options,
      token: getEnv('token', token, 'GITLAB_TOKEN', 'GL_TOKEN'),
    };

    this.client = new Gitlab({
      token: this.options.token,
    });
  }

  get name(): string {
    return 'gitlab';
  }

  get originalKeyInfos(): KeyInfo[] {
    return [
      {
        name: prefix(this.options.prefix, 'GITLAB_TOKEN'),
        value: this.options.token,
      },
    ];
  }

  async source(): Promise<KeyInfo[]> {
    const currentToken = await this.client.requester.get<PersonalAccessTokenSchema>(
      'https://gitlab.com/api/v4/personal_access_tokens/self'
    );

    const { body: token } = await this.client.requester.post<RotatedPersonalAccessTokenSchema>(
      `https://gitlab.com/api/v4/personal_access_tokens/${currentToken.body.id}/rotate`
    );

    this.token = token;

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
    process.env.GITLAB_TOKEN = this.token.token;

    return [
      {
        name: prefix(this.options.prefix, 'GITLAB_TOKEN'),
        value: this.token.token,
      },
    ];
  }

  async revert(): Promise<void> {
    throw new Error(`(${this.name}) Recovery isn't possible, please manually create a new token...`);
  }

  async cleanup(): Promise<void> {
    Logger.silly(`(${this.name}) GitLab uses a key rotation endpoint, as such no cleanup is needed!`);
  }
}

export namespace GitLabSourceModule {
  export type Options = {
    tokenName?: string;
    token?: string;
    prefix?: string;
  } & SourceModule.Options;
}
