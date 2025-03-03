import { UpdateAction } from '../../src/update-action'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { Git, Inputs } from '../../src/common'
import * as core from '@actions/core'

class MockUpdateAction extends UpdateAction {
  protected override async updateVersion(version: string): Promise<void> {
  }
}

jest.mock('@actions/core')

describe('UpdateAction', () => {
  let updateAction: UpdateAction
  let git: DeepMockProxy<Git>

  beforeEach(() => {
    git = mockDeep<Git>()
    updateAction = new MockUpdateAction(git)

    jest.mocked(core.info).mockImplementation(jest.fn())
  })

  describe('run', () => {
    it('should update version and lock file, and push commit', async () => {
      const inputs: Inputs = {
        runtime: 'node',
        releaseTag: 'v1.0.0',
        commitUserEmail: 'github-actions[bot]@users.noreply.github.com',
        commitUserName: 'github-actions[bot]',
        commitMessage: 'ci: updated package version'
      }

      await updateAction.run(inputs)

      expect(git.setConfig).toHaveBeenCalledWith('github-actions[bot]@users.noreply.github.com', 'github-actions[bot]')
      expect(git.addAllFiles).toHaveBeenCalled()
      expect(git.commit).toHaveBeenCalledWith('ci: updated package version 1.0.0')
      expect(git.push).toHaveBeenCalled()
    })
  })

  describe('parseReleaseTagToVersion', () => {
    it('should parse valid version tag correctly', () => {
      const version = (updateAction as any).parseReleaseTagToVersion('v1.2.3')
      expect(version).toBe('1.2.3')
    })

    it('should throw an error for invalid version tag', () => {
      expect(() => (updateAction as any).parseReleaseTagToVersion('1.2.3'))
        .toThrow('Invalid release tag, tag format must be vX.X.X')
    })
  })
})