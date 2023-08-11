import { SourceModule, KeyInfo, getEnv, PartiallyRequired } from '@refreshly/core';
import { AccessKey, createAwsAccessKey, deleteAwsAccessKey } from './aws/access-keys';

export class AWSSourceModule extends SourceModule {
  private options: PartiallyRequired<Omit<AWSSourceModule.Options, keyof SourceModule.Options>, 'key' | 'secretKey'>;

  private accessKey?: AccessKey;

  constructor({ targets, key, secretKey, ...options }: AWSSourceModule.Options) {
    super({ targets });

    this.options = {
      ...options,
      key: getEnv('key', key, 'AWS_ACCESS_KEY_ID'),
      secretKey: getEnv('secretKey', secretKey, 'AWS_SECRET_ACCESS_KEY'),
    };
  }

  get name(): string {
    return 'aws';
  }

  get originalKeyInfos(): KeyInfo[] {
    return [
      {
        name: 'AWS_ACCESS_KEY_ID',
        value: this.options.key,
      },
      {
        name: 'AWS_SECRET_ACCESS_KEY',
        value: this.options.secretKey,
      },
    ];
  }

  async source(): Promise<KeyInfo[]> {
    const accessKey = await createAwsAccessKey({
      key: this.options.key,
      secretKey: this.options.secretKey,
    });

    this.accessKey = accessKey;

    // Why the hell do I have to arbitrarily wait?
    // What is propagating on Amazon's backend that results in the token not being immediately usable?
    await new Promise((resolve) => setTimeout(resolve, 7000));

    return [
      {
        name: 'AWS_ACCESS_KEY_ID',
        value: accessKey.key,
      },
      {
        name: 'AWS_SECRET_ACCESS_KEY',
        value: accessKey.secretKey,
      },
    ];
  }

  async revert(): Promise<void> {
    if (!this.accessKey) return;

    await deleteAwsAccessKey({
      key: this.accessKey.key,
      secretKey: this.accessKey.secretKey,
    });
  }

  async cleanup(): Promise<void> {
    await deleteAwsAccessKey({
      key: this.options.key,
      secretKey: this.options.secretKey,
    });
  }
}

export namespace AWSSourceModule {
  export type Options = {
    key?: string;
    secretKey?: string;
    prefix?: string;
  } & SourceModule.Options;
}
