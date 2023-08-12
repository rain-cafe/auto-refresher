import { chance } from '@refreshly/test-utils';
import { GitLab } from '..';
import { rotatePersonalAccessToken } from '../gitlab/personal-access-token';

jest.mock('../gitlab/personal-access-token');
const rotatePersonalAccessTokenMocked = jest.mocked(rotatePersonalAccessToken);

describe('source(GitLab.Source)', () => {
  describe('get(name)', () => {
    it('should return the source name', () => {
      const module = new GitLab.Source({
        token: chance.string(),
        targets: [],
      });

      expect(module.name).toEqual('gitlab');
    });
  });

  describe('get(originalKeyInfos)', () => {
    it('should return the original token', () => {
      const expectedToken = chance.string();

      const module = new GitLab.Source({
        token: expectedToken,
        targets: [],
      });

      expect(module.originalKeyInfos).toEqual([
        {
          name: 'GITLAB_TOKEN',
          value: expectedToken,
        },
      ]);
    });
  });

  describe('func(source)', () => {
    it('should fetch a new token', async () => {
      const updatedToken = chance.string();

      rotatePersonalAccessTokenMocked.mockResolvedValue(updatedToken);

      const module = new GitLab.Source({
        token: chance.string(),
        targets: [],
      });

      await expect(module.source()).resolves.toEqual([
        {
          name: 'GITLAB_TOKEN',
          value: updatedToken,
        },
      ]);

      expect(process.env.GITLAB_TOKEN).toEqual(updatedToken);
    });
  });

  describe('func(revert)', () => {
    it('should throw an error', async () => {
      const module = new GitLab.Source({
        token: chance.string(),
        targets: [],
      });

      await expect(module.revert()).rejects.toThrow();
    });
  });
});
