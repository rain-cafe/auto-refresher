import { KeyInfo } from '../..';
import * as fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { keyInfoToKeyValue, keyValueToKeyInfo } from './keyinfo';

export async function read(path: string): Promise<KeyInfo[]> {
  const content = await fs.readFile(path, {
    encoding: 'utf-8',
  });

  return content.split(/\r?\n/).filter(Boolean).map<KeyInfo>(keyValueToKeyInfo);
}

export function readSync(path: string): KeyInfo[] {
  const content = readFileSync(path, {
    encoding: 'utf-8',
  });

  return content.split(/\r?\n/).filter(Boolean).map<KeyInfo>(keyValueToKeyInfo);
}

export async function write(path: string, keyInfos: KeyInfo[]): Promise<void> {
  await fs.writeFile(path, keyInfos.map(keyInfoToKeyValue).join('\n'), {
    encoding: 'utf-8',
  });
}

export async function merge(path: string, keyInfos: KeyInfo[]): Promise<void> {
  const existingKeyInfos = await read(path);
  const mergedKeyInfos: KeyInfo[] = [...keyInfos];

  for (const existingKeyInfo of existingKeyInfos) {
    if (mergedKeyInfos.find((keyInfo) => keyInfo.name === existingKeyInfo.name)) continue;

    mergedKeyInfos.push(existingKeyInfo);
  }

  await write(path, mergedKeyInfos);
}
