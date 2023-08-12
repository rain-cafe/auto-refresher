import path from 'node:path';
import { KeyInfo } from '../types';
import { SourceModule } from '../modules';
import { read, readSync } from './utils/dotenv';

export class DotEnvSourceModule extends SourceModule {
  private options: Omit<DotEnvSourceModule.Options, keyof SourceModule.Options>;
  private keyInfos: KeyInfo[];

  constructor({ targets, prefix, file, ...options }: DotEnvSourceModule.Options) {
    super({ targets, prefix });

    this.options = {
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
}

export namespace DotEnvSourceModule {
  export type Options = {
    file: string;
    properties?: string[];
  } & SourceModule.Options;
}
