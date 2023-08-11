import { KeyInfo } from '../../types';
import * as fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { keyInfoToKeyValue, keyValueToKeyInfo } from './keyinfo';

function parseDotEnv(content: string, properties?: string[]): KeyInfo[] {
  return content
    .split(/\r?\n/)
    .filter(Boolean)
    .map<KeyInfo>(keyValueToKeyInfo)
    .filter((keyInfo) => !properties || properties.includes(keyInfo.name));
}

export async function read(path: string, properties?: string[]): Promise<KeyInfo[]> {
  try {
    const content = await fs.readFile(path, {
      encoding: 'utf-8',
    });

    return parseDotEnv(content, properties);
  } catch {
    return [];
  }
}

export function readSync(path: string, properties?: string[]): KeyInfo[] {
  try {
    const content = readFileSync(path, {
      encoding: 'utf-8',
    });

    return parseDotEnv(content, properties);
  } catch {
    return [];
  }
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
