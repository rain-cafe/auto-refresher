import { ITargetModule, KeyInfo } from '../@types';
import path from 'node:path';
import { merge } from './utils/dotenv';

export class FSTargetModule implements ITargetModule {
  private options: FSTargetModule.Options;

  constructor({ file, ...options }: FSTargetModule.Options) {
    this.options = {
      ...options,
      file: path.join(process.cwd(), file),
    };
  }

  get name(): string {
    return 'fs';
  }

  async target(keyInfos: KeyInfo[]): Promise<void> {
    return await merge(this.options.file, keyInfos);
  }
}

export namespace FSTargetModule {
  export interface Options {
    file: string;
  }
}
