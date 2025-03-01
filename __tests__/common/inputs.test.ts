import * as core from '@actions/core'
import { getInputs, Inputs } from '../../src/common'

jest.mock('@actions/core')

describe('Inputs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the correct inputs', () => {
    ;(core.getInput as jest.Mock)
      .mockReturnValueOnce('node16')
      .mockReturnValueOnce('v1.0.0')
      .mockReturnValueOnce('user@example.com')
      .mockReturnValueOnce('GitHub Actions')
      .mockReturnValueOnce('chore: release v1.0.0')

    const expectedInputs: Inputs = {
      runtime: 'node16',
      releaseTag: 'v1.0.0',
      commitUserEmail: 'user@example.com',
      commitUserName: 'GitHub Actions',
      commitMessage: 'chore: release v1.0.0'
    }

    const inputs = getInputs()

    expect(inputs).toEqual(expectedInputs)

    expect(core.getInput).toHaveBeenCalledWith('runtime')
    expect(core.getInput).toHaveBeenCalledWith('release_tag')
    expect(core.getInput).toHaveBeenCalledWith('commit_user_email')
    expect(core.getInput).toHaveBeenCalledWith('commit_user_name')
    expect(core.getInput).toHaveBeenCalledWith('commit_message')
  })
})
