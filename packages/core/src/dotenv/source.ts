import path from 'node:path';
import { SourceModule, KeyInfo } from '../types';
import { read, readSync } from './utils/dotenv';

export class DotEnvSourceModule extends SourceModule {
  protected declare options: DotEnvSourceModule.Options;
  private keyInfos: KeyInfo[];

  constructor({ targets, file, ...options }: DotEnvSourceModule.Options) {
    super({ targets });

    this.options = {
      ...this.options,
      ...options,
      file: path.isAbsolute(file) ? file : path.join(process.cwd(), file),
    };

    this.keyInfos = readSync(this.options.file, this.options.properties);
  }

  get name(): string {
    return 'dotenv';
  }

  get originalKeyInfos(): KeyInfo[] {
    return this.keyInfos;
  }

  async source(): Promise<KeyInfo[]> {
    return await read(this.options.file, this.options.properties);
  }

  async revert(): Promise<void> {}

  async cleanup(): Promise<void> {}
}

namespace DotEnvSourceModule {
  export type Options = {
    file: string;
    properties?: string[];
  } & SourceModule.Options;
}
