import { execCommand, Git } from '../../src/common'

jest.mock('../../src/common/exec', () => ({
  execCommand: jest.fn().mockResolvedValue(undefined)
}))

describe('Git', () => {
  let git: Git

  beforeEach(() => {
    jest.clearAllMocks()
    git = new Git()
  })

  describe('checkout', () => {
    it('should call execCommand with the correct branch name when branch starts with refs/heads/', async () => {
      const branch = 'refs/heads/feature-branch'
      const expected = 'feature-branch'

      await git.checkout(branch)

      expect(execCommand).toHaveBeenCalledWith(`git checkout -b ${expected}`)
    })

    it('should call execCommand with the original branch name when branch does not start with refs/heads/', async () => {
      const branch = 'feature-branch'

      await git.checkout(branch)

      expect(execCommand).toHaveBeenCalledWith(`git checkout -b ${branch}`)
    })
  })
})
