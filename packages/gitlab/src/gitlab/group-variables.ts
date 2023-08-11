import { Gitlab, VariableSchema } from '@gitbeaker/core';
import { KeyInfo } from '@refreshly/core';
import { GitLabType, getType } from './type';

export function getVariables(client: Gitlab, type: GitLabType, id: string): Promise<VariableSchema[]> {
  if (type === GitLabType.GROUP) {
    return client.GroupVariables.all(id);
  }

  return client.ProjectVariables.all(id);
}

export async function getVariableNames(client: Gitlab, type: GitLabType, id: string): Promise<string[]> {
  const variables = await getVariables(client, type, id);

  return variables.map((variable) => variable.key);
}

export async function edit(
  client: Gitlab,
  type: GitLabType,
  id: string,
  key: string,
  value: string
): Promise<VariableSchema> {
  if (type === GitLabType.GROUP) {
    return client.GroupVariables.edit(id, key, value);
  }

  return client.ProjectVariables.edit(id, key, value);
}

export async function create(
  client: Gitlab,
  type: GitLabType,
  id: string,
  key: string,
  value: string
): Promise<VariableSchema> {
  if (type === GitLabType.GROUP) {
    return client.GroupVariables.create(id, key, value);
  }

  return client.ProjectVariables.create(id, key, value);
}

/**
 * Creates the group variable if it doesn't exist
 * @param client The Gitlab client
 * @param id
 * @param key
 * @param value
 */
export async function editSafe(client: Gitlab, id: string, keyInfos: KeyInfo[]): Promise<void> {
  const type = await getType(client, id);
  const variables = await getVariableNames(client, type, id);

  await Promise.all(
    keyInfos.map(async (keyInfo) => {
      if (variables.includes(keyInfo.name)) {
        await edit(client, type, id, keyInfo.name, keyInfo.value);
      } else {
        await create(client, type, id, keyInfo.name, keyInfo.value);
      }
    })
  );
}
