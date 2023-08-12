import { Gitlab as GitlabBase } from '@gitbeaker/core';
import { Gitlab, VariableSchema } from '@gitbeaker/rest';
import { KeyInfo } from '@refreshly/core';
import { getTypes } from './type';
import { GitLabType, IdRequest, IdsRequest } from './types';

export type KeyInfosRequest = IdsRequest & {
  keyInfos: KeyInfo[];
};

export function getVariables(client: GitlabBase, type: GitLabType, id: string): Promise<VariableSchema[]> {
  if (type === GitLabType.GROUP) {
    return client.GroupVariables.all(id);
  }

  return client.ProjectVariables.all(id);
}

export async function getVariableNames(client: GitlabBase, type: GitLabType, id: string): Promise<string[]> {
  const variables = await getVariables(client, type, id);

  return variables.map((variable) => variable.key);
}

export type EditRequest = IdRequest & {
  type: GitLabType;
  keyInfo: KeyInfo;
  exists: boolean;
};

export async function edit({ token, type, id, keyInfo, exists }: EditRequest): Promise<VariableSchema> {
  const client = new Gitlab({
    token,
  });

  const Variables = type === GitLabType.GROUP ? client.GroupVariables : client.ProjectVariables;

  if (exists) {
    return Variables.edit(id, keyInfo.name, keyInfo.value);
  }

  return Variables.create(id, keyInfo.name, keyInfo.value);
}

/**
 * Creates the group variable if it doesn't exist
 * @param client The Gitlab client
 * @param id
 * @param key
 * @param value
 */
export async function editSafe({ token, ids, keyInfos }: KeyInfosRequest): Promise<void> {
  const client = new Gitlab({
    token,
  });

  const types = await getTypes({
    ids,
    token,
  });

  await Promise.all(
    types.map(async ({ id, type }) => {
      const variables = await getVariableNames(client, type, id);

      await Promise.all(
        keyInfos.map(async (keyInfo) => {
          await edit({
            id,
            token,
            keyInfo,
            type,
            exists: variables.includes(keyInfo.name),
          });
        })
      );
    })
  );
}
