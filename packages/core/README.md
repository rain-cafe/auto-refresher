<h3 align="center">
  Simply a key rotation tool!~ :heart:
</h3>

<div align="center">

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]

[![CI Build][github-actions-image]][github-actions-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![zx-bulk-release][zx-bulk-release-image]][zx-bulk-release-url]

</div>

## Install

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

## Usage

```ts
import { Refreshly } from '@refreshly/core';
import { AWS } from '@refreshly/aws';
import { GitHub } from '@refreshly/github';

Refreshly(
  new AWS.Source({
    key: myAwsAccessKeyId, // process.env.AWS_ACCESS_KEY_ID
    secretKey: myAwsSecretAccessKey, // process.env.AWS_SECRET_ACCESS_KEY
    user: 'rain-ci',
    prefix: 'CI_ONLY_',
    targets: [
      new GitHub.Target({
        token: myGitHubToken, // process.env.GH_TOKEN || process.env.GITHUB_TOKEN
        org: 'rain-cafe',
      }),
    ],
  })
);
```

## Known Issues

_These are issues that we know about, but don't have a clear fix for!_

**There are currently no known issues, thanks for checking!**

[npm-version-image]: https://img.shields.io/npm/v/@refreshly/core.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@refreshly/core.svg?style=flat
[npm-url]: https://npmjs.org/package/@refreshly/core
[github-actions-image]: https://github.com/rain-cafe/refreshly/actions/workflows/ci.yml/badge.svg?branch=main
[github-actions-url]: https://github.com/rain-cafe/refreshly/actions/workflows/ci.yml
[coveralls-image]: https://img.shields.io/coveralls/rain-cafe/refreshly.svg
[coveralls-url]: https://coveralls.io/github/rain-cafe/refreshly?branch=main
[zx-bulk-release-url]: https://github.com/semrel-extra/zx-bulk-release
[zx-bulk-release-image]: https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-zx--bulk--release-e10079?style=flat
