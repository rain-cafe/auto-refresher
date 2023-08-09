import { KeyInfo } from '../../@types/key-info';

export function keyInfoToKeyValue(keyInfo: KeyInfo): string {
  return `${keyInfo.name}=${keyInfo.value}`;
}

export function keyValueToKeyInfo(keyValue: string): KeyInfo {
  const [name, value] = keyValue.split('=');

  return {
    name,
    value,
  };
}
