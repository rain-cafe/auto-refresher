<h2 align="center">
  <div>
    <a href="https://github.com/ribbon-studios/refreshly">
      <img src="https://raw.githubusercontent.com/ribbon-studios/logos/main/refreshly/npm.png?sanitize=true">
    </a>
  </div>
</h2>

<h3 align="center">
  Simply a key rotation tool!~ :heart:
</h3>

<p align="center">
	<strong>
		<a href="https://refreshly.ribbonstudios.com" target="_blank">Docs</a>
	</strong>
</p>

<div align="center">

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![CI Build][github-actions-image]][github-actions-url]

[![Code Style: Prettier][code-style-image]][code-style-url]
[![Maintainability][maintainability-image]][maintainability-url]
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
    prefix: 'CI_ONLY_',
    targets: [
      new GitHub.Target({
        token: myGitHubToken, // process.env.GH_TOKEN || process.env.GITHUB_TOKEN
        orgs: ['ribbon-studios'],
      }),
    ],
  })
);
```

[npm-version-image]: https://img.shields.io/npm/v/@refreshly/core.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/@refreshly/core.svg
[npm-url]: https://npmjs.org/package/@refreshly/core
[github-actions-image]: https://img.shields.io/github/actions/workflow/status/ribbon-studios/refreshly/ci.yml?event=push&style=flat
[github-actions-url]: https://github.com/ribbon-studios/refreshly/actions/workflows/ci.yml
[coveralls-image]: https://img.shields.io/coveralls/ribbon-studios/refreshly.svg
[coveralls-url]: https://coveralls.io/github/ribbon-studios/refreshly?branch=main
[code-style-image]: https://img.shields.io/badge/code%20style-prettier-ff69b4.svg
[code-style-url]: https://prettier.io
[maintainability-image]: https://img.shields.io/codeclimate/maintainability/ribbon-studios/refreshly
[maintainability-url]: https://codeclimate.com/github/ribbon-studios/refreshly/maintainability
[zx-bulk-release-url]: https://github.com/semrel-extra/zx-bulk-release
[zx-bulk-release-image]: https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-zx--bulk--release-e10079
