import { SourceModule } from './@types/source-module';

export async function Refreshly(...sources: SourceModule[]) {
  await Promise.all(
    sources.map(async (source) => {
      await source.exec();
    })
  );
}

export * from './@types';
