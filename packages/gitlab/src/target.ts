import { TargetModule, KeyInfo, getEnv } from '@refreshly/core';
import { editSafe } from './gitlab/group-variables';

export class GitLabTargetModule extends TargetModule {
  private options: Omit<GitLabTargetModule.Options, keyof TargetModule.Options>;

  constructor({ prefix, ...options }: GitLabTargetModule.Options) {
    super({ prefix });

    this.options = options;
  }

  get name(): string {
    return 'gitlab';
  }

  async target(keyInfos: KeyInfo[]): Promise<void> {
    await editSafe({
      /**
       * I absolutely hate this, it's a hack purely to get Gitlab.Source to work in conjunction with Gitlab.Target :<
       * See the source module for more information.
       */
      token: getEnv('token', this.options.token, 'GITLAB_TOKEN', 'GL_TOKEN'),
      ids: this.options.ids,
      keyInfos,
    });
  }
}

export namespace GitLabTargetModule {
  export type Options = {
    /**
     * Your GitLab Personal Access Token!
     *
     * (env: GITHUB_TOKEN or GH_TOKEN)
     */
    token?: string;

    /**
     * The Group / Project IDs
     */
    ids: string[];
  } & TargetModule.Options;
}
