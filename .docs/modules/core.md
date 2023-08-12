# `@refreshly/core`

The core comes pre-packaged with a `.env` module that can act as either a source or a target.
This module is primarily for testing purposes, although you could certainly utilize it if you find a usecase for it!

```tsx
import { Refreshly, DotEnv } from '@refreshly/core';
import { AWS } from '@refreshly/aws';

// This will read the .env file in the cwd and pipe its contents back out to the same .env
Refreshly(
  new DotEnv.Source({
    file: '.env',
    targets: [
      new DotEnv.Target({
        file: '.env',
      }),
    ],
  })
);
```
