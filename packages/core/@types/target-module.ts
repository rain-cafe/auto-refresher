import { KeyInfo } from './key-info';

export interface ITargetModule {
  get name(): string;

  target(keyInfos: KeyInfo[]): Promise<void>;
  revert(keyInfos: KeyInfo[]): Promise<void>;
}
