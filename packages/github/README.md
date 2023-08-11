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

## Description

This is the GitHub Module for [Refreshly](https://github.com/rain-cafe/refreshly)!

## Usage

```ts
import { Refreshly, DotEnv } from '@refreshly/core';
import { GitHub } from '@refreshly/github';

Refreshly(
  new DotEnv.Source({
    file: '.env',
    targets: [
      new GitHub.Target({
        token: myGitLabToken, // process.env.GH_TOKEN || process.env.GITHUB_TOKEN
        org: 'rain-cafe',
      }),
    ],
  })
);
```

[npm-version-image]: https://img.shields.io/npm/v/@refreshly/github.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@refreshly/github.svg?style=flat
[npm-url]: https://npmjs.org/package/@refreshly/github
[github-actions-image]: https://github.com/rain-cafe/refreshly/actions/workflows/ci.yml/badge.svg?branch=main
[github-actions-url]: https://github.com/rain-cafe/refreshly/actions/workflows/ci.yml
[coveralls-image]: https://img.shields.io/coveralls/rain-cafe/refreshly.svg
[coveralls-url]: https://coveralls.io/github/rain-cafe/refreshly?branch=main
[zx-bulk-release-url]: https://github.com/semrel-extra/zx-bulk-release
[zx-bulk-release-image]: https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-zx--bulk--release-e10079?style=flat
