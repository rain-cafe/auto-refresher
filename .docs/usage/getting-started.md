# Getting Started

## Setting up Refreshly

### Install

**NPM**

```sh
$ npm install @refreshly/core @refreshly/aws @refreshly/github
```

**Yarn**

```sh
$ yarn add @refreshly/core @refreshly/aws @refreshly/github
```

**PNPM**

```sh
$ pnpm add @refreshly/core @refreshly/aws @refreshly/github
```

### Usage

```tsx
import { Refreshly } from '@refreshly/core';
import { AWS } from '@refreshly/aws';
import { GitHub } from '@refreshly/github';

Refreshly(
  new AWS.Source({
    key: myAwsAccessKeyId, // process.env.AWS_ACCESS_KEY_ID
    secretKey: myAwsSecretAccessKey, // process.env.AWS_SECRET_ACCESS_KEY
    prefix: 'CI_ONLY_',
    targets: [
      new GitHub.Target({
        token: myGitHubToken, // process.env.GH_TOKEN || process.env.GITHUB_TOKEN
        orgs: ['rain-cafe'],
      }),
    ],
  })
);
```
