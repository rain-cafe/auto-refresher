import { KeyInfo } from '../types/key-info';

export abstract class TargetModule {
  #prefix?: string;

  constructor({ prefix }: TargetModule.Options) {
    this.#prefix = prefix;
  }

  prefix(keyInfos: KeyInfo[]): KeyInfo[] {
    const prefix = this.#prefix;
    if (prefix) {
      return keyInfos.map((keyInfo) => ({
        name: prefix.concat(keyInfo.name),
        value: keyInfo.value,
      }));
    }

    return keyInfos;
  }

  abstract get name(): string;

  abstract target(keyInfos: KeyInfo[]): Promise<void>;
}

export namespace TargetModule {
  export type Options = {
    prefix?: string;
  };
}
