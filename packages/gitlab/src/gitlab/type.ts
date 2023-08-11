import { Gitlab } from '@gitbeaker/core';

export enum GitLabType {
  GROUP,
  PROJECT,
}

export async function getType(client: Gitlab, id: string): Promise<GitLabType> {
  const group = await client.Groups.show(id)
    .then(() => true)
    .catch(() => false);

  if (group) {
    return GitLabType.GROUP;
  }

  const project = await client.Projects.show(id)
    .then(() => true)
    .catch(() => false);

  if (project) {
    return GitLabType.PROJECT;
  }

  throw new Error(`Unknown group / project id! (${id})`);
}
