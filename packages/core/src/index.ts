import { LogLevel, Logger } from '@rain-cafe/logger';
import { SourceModule } from './modules';

export async function Refreshly(...sources: SourceModule[]) {
  try {
    Logger.info('Refreshing keys...');

    await Promise.all(
      sources.map(async (source) => {
        Logger.silly(`(${source.name}) Executing... `);
        await source.exec();
      })
    );

    Logger.info('Refreshly completed successfully!');
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
}

// This is temporary
export function getEnv<T>(configKey: string, configValue?: T, ...keys: string[]): T {
  if (configValue) return configValue;

  for (const key of keys) {
    const value = process.env[key];

    if (value) {
      return value as T;
    }
  }

  throw new Error(`Expected "${configKey}" to be provided via... (config.${configKey}, ${keys.join(', ')})`);
}

export * from './modules';
export * from './types';
export * from './dotenv';
export { LogLevel, Logger };
