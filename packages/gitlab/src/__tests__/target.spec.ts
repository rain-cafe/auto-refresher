import { chance } from '@refreshly/test-utils';
import { GitLab } from '..';
import { editSafe } from '../gitlab/group-variables';
import { KeyInfo } from '@refreshly/core';

jest.mock('../gitlab/group-variables');
const editSafeMocked = jest.mocked(editSafe);

describe('source(GitLab.Target)', () => {
  describe('get(name)', () => {
    it('should return the target name', () => {
      const module = new GitLab.Target({
        token: chance.string(),
        ids: [],
      });

      expect(module.name).toEqual('gitlab');
    });
  });

  describe('func(target)', () => {
    it('should update the group / project variables with the new keys', async () => {
      const expectedToken = chance.string();
      const expectedIds = chance.n<string>(chance.string, chance.d4());
      const expectedKeyInfos = chance.n<KeyInfo>(
        () => ({
          name: chance.string(),
          value: chance.string(),
        }),
        chance.d4()
      );

      const module = new GitLab.Target({
        token: expectedToken,
        ids: expectedIds,
      });

      await module.target(expectedKeyInfos);

      expect(editSafeMocked).toHaveBeenCalledWith({
        token: expectedToken,
        ids: expectedIds,
        keyInfos: expectedKeyInfos,
      });
    });
  });
});
