import { Logger } from '@rain-cafe/logger';
import { KeyInfo } from './key-info';
import { ITargetModule } from './target-module';

export abstract class SourceModule {
  protected options: SourceModule.Options;

  constructor(options: SourceModule.Options) {
    this.options = options;
  }

  abstract get name(): string;

  abstract get originalKeyInfos(): KeyInfo[];

  async exec(): Promise<void> {
    try {
      Logger.silly(`(${this.name}) Getting the new value`);
      const keyInfos = await this.source();
      Logger.info(`(${this.name}) Successfully retrieved new value!`);

      if (this.options.targets.length === 0) {
        Logger.error('Please provide a list of targets');

        return await this.revert();
      }

      await Promise.all(
        this.options.targets.map(async (target) => {
          Logger.silly(`(${target.name}) Updating...`);
          await target.target(keyInfos);
          Logger.info(`(${target.name}) Successfully updated!`);
        })
      );

      Logger.silly('Successfully updated targets!');

      await this.cleanup();
    } catch (error) {
      Logger.error('Error detected, reverting to previous state...', error);

      await Promise.all(
        this.options.targets.map(async (target) => {
          Logger.silly(`(${target.name}) Reverting...`);
          await target.target(this.originalKeyInfos);
          Logger.silly(`(${target.name}) Successfully reverted!`);
        })
      );

      Logger.info('Successfully reverted targets!');

      Logger.silly(`(${this.name}) Reverting...`);
      await this.revert();
      Logger.info(`(${this.name}) Successfully reverted!`);

      throw error;
    }
  }

  abstract source(): Promise<KeyInfo[]>;

  /**
   * Revert any changes we did and put everything back the way it was
   */
  abstract revert(): Promise<void>;

  /**
   * Nothing went wrong, we just need to cleanup any old information!
   */
  abstract cleanup(): Promise<void>;
}

export namespace SourceModule {
  export type Options = {
    targets: ITargetModule[];
  };
}
