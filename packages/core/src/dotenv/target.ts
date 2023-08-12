import { TargetModule } from '../modules';
import { KeyInfo } from '../types';
import path from 'node:path';
import { merge } from './utils/dotenv';

export class DotEnvTargetModule extends TargetModule {
  private options: Omit<DotEnvTargetModule.Options, keyof TargetModule.Options>;

  constructor({ file, prefix, ...options }: DotEnvTargetModule.Options) {
    super({ prefix });

    this.options = {
      ...options,
      file: path.isAbsolute(file) ? file : path.join(process.cwd(), file),
    };
  }

  get name(): string {
    return 'dotenv';
  }

  async target(keyInfos: KeyInfo[]): Promise<void> {
    return await merge(this.options.file, keyInfos);
  }
}

export namespace DotEnvTargetModule {
  export type Options = {
    file: string;
  } & TargetModule.Options;
}
