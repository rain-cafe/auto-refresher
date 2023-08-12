/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { Logger } from '@rain-cafe/logger';
import { KeyInfo } from '../types/key-info';
import { TargetModule } from './target';

export abstract class SourceModule {
  #targets: TargetModule[];
  #prefix?: string;

  constructor({ prefix, targets }: SourceModule.Options) {
    this.#targets = targets;
    this.#prefix = prefix;
  }

  abstract get name(): string;

  abstract get originalKeyInfos(): KeyInfo[];

  async prefix(keyInfosPromise: Promise<KeyInfo[]>): Promise<KeyInfo[]> {
    const keyInfos = await keyInfosPromise;

    const prefix = this.#prefix;
    if (prefix) {
      return keyInfos.map((keyInfo) => ({
        name: prefix.concat(keyInfo.name),
        value: keyInfo.value,
      }));
    }

    return keyInfos;
  }

  async exec(): Promise<void> {
    try {
      Logger.silly(`(${this.name}) Getting the new value`);
      const keyInfos = await this.prefix(this.source());
      Logger.info(`(${this.name}) Successfully retrieved new value!`);

      if (this.#targets.length === 0) {
        Logger.error('Please provide a list of targets');

        if (this.revert) {
          await this.revert();
        }

        return;
      }

      await Promise.all(
        this.#targets.map(async (target) => {
          Logger.silly(`(${target.name}) Updating...`);
          await target.target(target.prefix(keyInfos));
          Logger.info(`(${target.name}) Successfully updated!`);
        })
      );

      Logger.silly('Successfully updated targets!');

      if (this.cleanup) {
        await this.cleanup();
      }
    } catch (error) {
      Logger.error('Error detected, reverting to previous state...', error);

      await Promise.all(
        this.#targets.map(async (target) => {
          Logger.silly(`(${target.name}) Reverting...`);
          await target.target(target.prefix(this.originalKeyInfos));
          Logger.silly(`(${target.name}) Successfully reverted!`);
        })
      );

      Logger.info('Successfully reverted targets!');

      if (this.revert) {
        Logger.silly(`(${this.name}) Reverting...`);
        await this.revert();
        Logger.info(`(${this.name}) Successfully reverted!`);
      }

      throw error;
    }
  }

  abstract source(): Promise<KeyInfo[]>;
}

export interface SourceModule {
  /**
   * Revert any changes we did and put everything back the way it was
   */
  revert?(): Promise<void>;

  /**
   * Nothing went wrong, we just need to cleanup any old information!
   */
  cleanup?(): Promise<void>;
}

export namespace SourceModule {
  export type Options = {
    targets: TargetModule[];
    prefix?: string;
  };
}
