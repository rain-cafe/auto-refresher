# Targets

Targets are the destinations of your newly acquired keys!

This could be anything from GitHub, GitLab, or your very own service!

```tsx
// target.ts
import { TargetModule, KeyInfo } from '@refreshly/core';

export class MyServiceTargetModule extends TargetModule {
  private options: Omit<MyServiceTargetModule.Options, keyof TargetModule.Options>;

  constructor({ prefix, ...options }: MyServiceTargetModule.Options) {
    super({ prefix });

    this.options = options;
  }

  get name(): string {
    // This is just used as an identifier for logging purposes
    return 'my-service';
  }

  async target(keyInfos: KeyInfo[]): Promise<void> {
    // Store the updated keys!
  }
}

export namespace MyServiceTargetModule {
  export type Options = {
    // Define your options here!
  } & TargetModule.Options;
}
```

- Even if you don't utilize the source, for consistencies-sake you should define a wrapper.

```tsx
// index.ts
export const MyService = {
  Target: MyServiceTargetModule,
};
```
