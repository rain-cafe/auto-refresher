export enum GitLabType {
  GROUP,
  PROJECT,
}

export type BaseRequest = {
  token: string;
};

export type IdsRequest = BaseRequest & {
  ids: string[];
};

export type IdRequest = BaseRequest & {
  id: string;
};
