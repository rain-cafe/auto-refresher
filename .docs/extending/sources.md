# Sources

Sources refresh the token for whatever service they're defined for.

As an example the `@refreshly/aws` source refreshes the AWS Access Token and Secret Key. <br/>
As such the value returned from `source()` is the following...

```tsx
[
  {
    name: 'AWS_ACCESS_TOKEN_ID',
    value: updatedAccessTokenID,
  },
  {
    name: 'AWS_SECRET_ACCESS_KEY',
    value: updatedSecretAccessKey,
  },
];
```

```tsx
// source.ts
import { KeyInfo, SourceModule } from '@refreshly/core';

export class MyServiceSourceModule extends SourceModule {
  private options: Omit<MyServiceSourceModule.Options, keyof SourceModule.Options>;

  constructor({ targets, ...options }: SourceModule.Options) {
    super({ targets });

    this.options = options;
  }

  get name(): string {
    // This is just used as an identifier for logging purposes
    return 'my-service';
  }

  get originalKeyInfos(): KeyInfo[] {
    // Return the initial keys here, they'll be used to
    // revert targets in the event something goes wrong.
    return [];
  }

  async source(): Promise<KeyInfo[]> {
    // Fetch the updated keys here and return them
    return [];
  }

  async revert(): Promise<void> {
    // This will be invoked if anything goes wrong.
  }

  async cleanup(): Promise<void> {
    // This will be invoked if everything is successful!
  }
}

export namespace MyServiceSourceModule {
  export type Options = {
    // Define your options here!
  } & SourceModule.Options;
}
```

- Even if you don't utilize the target, for consistencies-sake you should define a wrapper.

```tsx
// index.ts
export const MyService = {
  Source: MyServiceSourceModule,
};
```
