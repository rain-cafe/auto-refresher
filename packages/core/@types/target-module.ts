import { KeyInfo } from './key-info';

export interface ITargetModule {
  target(keyInfos: KeyInfo[]): Promise<void>;
  revert(keyInfos: KeyInfo[]): Promise<void>;
}
