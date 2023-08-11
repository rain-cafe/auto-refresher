import { LogLevel, Logger } from '@rain-cafe/logger';
import { SourceModule } from './types/source-module';

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
    console.error(error);
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

export function prefix(...values: Array<string | null | undefined>): string {
  return values.filter(Boolean).join('');
}

export * from './types';
export * from './dotenv';
export { LogLevel, Logger };
