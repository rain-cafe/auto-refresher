import { KeyInfo } from './key-info';
import { ITargetModule } from './target-module';

export abstract class SourceModule {
  #options: SourceModule.Options;

  constructor(options: SourceModule.Options) {
    this.#options = options;
  }

  abstract get originalKeyInfos(): KeyInfo[];

  async exec(): Promise<void> {
    const keyInfos = await this.source();

    try {
      await Promise.all(
        this.#options.targets.map(async (target) => {
          await target.target(keyInfos);
        })
      );

      console.log('Successfully updated targets!');

      await this.cleanup();
    } catch (error) {
      console.log(`Error detected, reverting to previous state...`);

      await Promise.all(
        this.#options.targets.map(async (target) => {
          await target.revert(this.originalKeyInfos);
        })
      );

      await this.revert();
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
    targets?: ITargetModule[];
  };
}
