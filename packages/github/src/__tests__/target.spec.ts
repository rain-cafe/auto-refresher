import { chance } from '@refreshly/test-utils';
import { GitHub } from '..';
import { createOrUpdateOrgSecrets } from '../github/secrets';
import { KeyInfo } from '@refreshly/core';

jest.mock('../github/secrets');
const createOrUpdateOrgSecretsMocked = jest.mocked(createOrUpdateOrgSecrets);

describe('source(GitLab.Target)', () => {
  describe('get(name)', () => {
    it('should return the target name', () => {
      const module = new GitHub.Target({
        token: chance.string(),
        orgs: [],
      });

      expect(module.name).toEqual('github');
    });
  });

  describe('func(target)', () => {
    it('should update the group / project variables with the new keys', async () => {
      const expectedToken = chance.string();
      const expectedOrgs = chance.n<string>(chance.string, chance.d4());
      const expectedKeyInfos = chance.n<KeyInfo>(
        () => ({
          name: chance.string(),
          value: chance.string(),
        }),
        chance.d4()
      );

      const module = new GitHub.Target({
        token: expectedToken,
        orgs: expectedOrgs,
      });

      await module.target(expectedKeyInfos);

      expect(createOrUpdateOrgSecretsMocked).toHaveBeenCalledWith({
        token: expectedToken,
        orgs: expectedOrgs,
        keyInfos: expectedKeyInfos,
      });
    });
  });
});
