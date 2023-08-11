import { ITargetModule, KeyInfo, getEnv, prefix } from '@refreshly/core';
import { Gitlab } from '@gitbeaker/rest';
import './gitlab/group-variables';
import { editSafe } from './gitlab/group-variables';

export class GitLabTargetModule implements ITargetModule {
  private options: GitLabTargetModule.Options;

  constructor(options: GitLabTargetModule.Options) {
    this.options = options;
  }

  get name(): string {
    return `gitlab:${this.options.id}`;
  }

  async target(keyInfos: KeyInfo[]): Promise<void> {
    /**
     * I absolutely hate this, it's a hack purely to get Gitlab.Source to work in conjunction with Gitlab.Target :<
     * See the source module for more information.
     */
    this.options.token = getEnv('token', this.options.token, 'GITLAB_TOKEN', 'GL_TOKEN');

    const client = new Gitlab({
      token: this.options.token,
    });

    await editSafe(
      client,
      this.options.id,
      keyInfos.map((keyInfo) => ({
        ...keyInfo,
        name: prefix(this.options.prefix, keyInfo.name),
      }))
    );
  }
}

export namespace GitLabTargetModule {
  export type Options = {
    prefix?: string;

    /**
     * Your GitLab Personal Access Token!
     *
     * (env: GITHUB_TOKEN or GH_TOKEN)
     */
    token?: string;

    /**
     * The Group ID or Project ID
     */
    id: string;
  };
}
