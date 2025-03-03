import * as core from '@actions/core'
import { getInputs, Inputs } from '../../src/common'

jest.mock('@actions/core')

describe('Inputs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the correct inputs', () => {
    ;(core.getInput as jest.Mock)
      .mockReturnValueOnce('node')
      .mockReturnValueOnce('v1.0.0')
      .mockReturnValueOnce('github-actions[bot]@users.noreply.github.com')
      .mockReturnValueOnce('github-actions[bot]')
      .mockReturnValueOnce('ci: updated package version')

    const expected: Inputs = {
      runtime: 'node',
      releaseTag: 'v1.0.0',
      commitUserEmail: 'github-actions[bot]@users.noreply.github.com',
      commitUserName: 'github-actions[bot]',
      commitMessage: 'ci: updated package version'
    }

    const inputs = getInputs()

    expect(inputs).toEqual(expected)

    expect(core.getInput).toHaveBeenCalledWith('runtime')
    expect(core.getInput).toHaveBeenCalledWith('release_tag')
    expect(core.getInput).toHaveBeenCalledWith('commit_user_email')
    expect(core.getInput).toHaveBeenCalledWith('commit_user_name')
    expect(core.getInput).toHaveBeenCalledWith('commit_message')
  })
})
