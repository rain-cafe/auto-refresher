import { CreateAccessKeyCommand, DeleteAccessKeyCommand, IAMClient } from '@aws-sdk/client-iam';

export type BaseRequest = {
  key: string;
  secretKey: string;
};

export type AccessKey = {
  key: string;
  secretKey: string;
};

export async function createAwsAccessKey({ key, secretKey }: BaseRequest): Promise<AccessKey> {
  const client = new IAMClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: key,
      secretAccessKey: secretKey,
    },
  });

  const { AccessKey } = await client.send(new CreateAccessKeyCommand({}));

  // ... why are these all specified as potentially being undefined?...
  // In what scenario would I create an access token, and not get one back that doesn't result in an error...
  if (!AccessKey || !AccessKey.AccessKeyId || !AccessKey.SecretAccessKey) {
    throw new Error('Access key was unexpectedly undefined after creating it!');
  }

  return {
    key: AccessKey.AccessKeyId,
    secretKey: AccessKey.SecretAccessKey,
  };
}

export async function deleteAwsAccessKey({ key, secretKey }: BaseRequest): Promise<void> {
  const client = new IAMClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: key,
      secretAccessKey: secretKey,
    },
  });

  await client.send(
    new DeleteAccessKeyCommand({
      AccessKeyId: key,
    })
  );
}
