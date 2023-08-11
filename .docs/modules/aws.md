# `@refreshly/aws`

This is a source module that rotates the aws access key you provide it!

## Usage

```tsx
import { Refreshly, DotEnv } from '@refreshly/core';
import { AWS } from '@refreshly/aws';

// This will generate a new access token and output the key and secret to a .env file
Refreshly(
  new AWS.Source({
    key: myAwsAccessKeyId, // process.env.AWS_ACCESS_KEY_ID
    secretKey: myAwsSecretAccessKey, // process.env.AWS_SECRET_ACCESS_KEY
    targets: [
      new DotEnv.Target({
        file: '.env',
      }),
    ],
  })
);
```

**Example Output**

```INI
# .env
AWS_ACCESS_KEY_ID=your-new-access-key-id
AWS_SECRET_ACCESS_KEY=your-new-secret-access-key
```
