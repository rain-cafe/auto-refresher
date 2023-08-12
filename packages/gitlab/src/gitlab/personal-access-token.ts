import { Gitlab, PersonalAccessTokenSchema } from '@gitbeaker/core';
import { BaseRequest } from './types';

export type RotatedPersonalAccessTokenSchema = PersonalAccessTokenSchema & { token: string };

export async function rotatePersonalAccessToken({ token }: BaseRequest): Promise<string> {
  const client = new Gitlab({
    token,
  });

  const currentToken = await client.requester.get<PersonalAccessTokenSchema>(
    'https://gitlab.com/api/v4/personal_access_tokens/self'
  );

  const {
    body: { token: rotatedToken },
  } = await client.requester.post<RotatedPersonalAccessTokenSchema>(
    `https://gitlab.com/api/v4/personal_access_tokens/${currentToken.body.id}/rotate`
  );

  return rotatedToken;
}
