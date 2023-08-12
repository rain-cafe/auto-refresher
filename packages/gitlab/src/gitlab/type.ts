import { Gitlab } from '@gitbeaker/rest';
import { GitLabType, IdsRequest } from './types';

export type TypeResponse = {
  id: string;
  type: GitLabType;
};

export async function getTypes({ token, ids }: IdsRequest): Promise<TypeResponse[]> {
  const client = new Gitlab({
    token,
  });

  return Promise.all(
    ids.map(async (id) => {
      const group = await client.Groups.show(id)
        .then(() => true)
        .catch(() => false);

      if (group) {
        return {
          id,
          type: GitLabType.GROUP,
        };
      }

      const project = await client.Projects.show(id)
        .then(() => true)
        .catch(() => false);

      if (project) {
        return {
          id,
          type: GitLabType.PROJECT,
        };
      }

      throw new Error(`Unknown group / project id! (${id})`);
    })
  );
}
