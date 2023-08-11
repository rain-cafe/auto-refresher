import { DotEnvSourceModule } from './source';
import { DotEnvTargetModule } from './target';

/**
 * @deprecated Please use {@link DotEnv} instead! :3
 */
export const FS = {
  Source: DotEnvSourceModule,
  Target: DotEnvTargetModule,
};

export const DotEnv = {
  Source: DotEnvSourceModule,
  Target: DotEnvTargetModule,
};
