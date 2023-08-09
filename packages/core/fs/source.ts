import path from 'node:path';
import { SourceModule, KeyInfo } from '../@types';
import { read, readSync } from './utils/dotenv';

export class FSSourceModule extends SourceModule {
  protected declare options: FSSourceModule.Options;
  private keyInfos: KeyInfo[];

  constructor({ targets, file, ...options }: FSSourceModule.Options) {
    super({ targets });

    this.options = {
      ...this.options,
      ...options,
      file: path.join(process.cwd(), file),
    };

    this.keyInfos = readSync(this.options.file);
  }

  get name(): string {
    return 'fs';
  }

  get originalKeyInfos(): KeyInfo[] {
    return this.keyInfos;
  }

  async source(): Promise<KeyInfo[]> {
    return await read(this.options.file);
  }

  async revert(): Promise<void> {}

  async cleanup(): Promise<void> {}
}

namespace FSSourceModule {
  export type Options = {
    file: string;
  } & SourceModule.Options;
}
