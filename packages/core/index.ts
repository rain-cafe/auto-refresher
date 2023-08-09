import { LogLevel, Logger } from '@rain-cafe/logger';
import { SourceModule } from './@types/source-module';

export async function Refreshly(...sources: SourceModule[]) {
  Logger.info('Refreshing keys...');

  try {
    await Promise.all(
      sources.map(async (source) => {
        Logger.silly(`(${source.name}) Executing... `);
        await source.exec();
      })
    );
  } catch (error) {
    Logger.error(error?.toString() ?? error);

    process.exit(1);
  }
}

export namespace Refreshly {
  export function setLogLevel(level: LogLevel): void {
    Logger.setLevel(level);
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

export function prefix(...values: string[]): string {
  return values.filter(Boolean).join('');
}

export * from './@types';
export { LogLevel };
