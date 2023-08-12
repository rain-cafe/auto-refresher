# `@refreshly/gitlab`

This is both a source and a target module!
The source rotates the GitLab token you provide it.
Whereas the target deploys your keys to GitLab CI / CD Variables.

## Usage

### As a Source

```ts
import { Refreshly, DotEnv } from '@refreshly/core';
import { GitLab } from '@refreshly/gitlab';

Refreshly(
  new GitLab.Source({
    token: myGitLabToken, // process.env.GL_TOKEN || process.env.GITLAB_TOKEN
    targets: [
      new DotEnv.Target({
        file: '.env',
      }),
    ],
  })
);
```

### As a Target

```ts
import { Refreshly, DotEnv } from '@refreshly/core';
import { GitLab } from '@refreshly/gitlab';

Refreshly(
  new DotEnv.Source({
    file: '.env',
    targets: [
      new GitLab.Target({
        token: myGitLabToken, // process.env.GL_TOKEN || process.env.GITLAB_TOKEN
        ids: ['<your-group-or-project-id>'],
      }),
    ],
  })
);
```

## Caveats

GitLab doesn't _really_ support deferring the deletion of the old token.
This results in a few issues...

1. We can't revert to the old token if a failure occurs
2. We have to update the environment variable so that 'Gitlab.Target' can pick it up.

As an aside, GitLab DOES have a [create token endpoint](https://docs.gitlab.com/ee/api/personal_access_tokens.html#create-a-personal-access-token-administrator-only), however its only usable by server admins making it effectively useless
