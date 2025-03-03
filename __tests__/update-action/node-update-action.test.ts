import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { Git, Inputs } from '../../src/common'
import { NodeUpdateAction } from '../../src/update-action'
import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'

jest.mock('../../src/common/exec', () => ({
  execCommand: jest.fn().mockResolvedValue(undefined)
}))
jest.mock('path')
jest.mock('@actions/core')

describe('NodeUpdateAction', () => {
  let nodeUpdateAction: NodeUpdateAction
  let git: DeepMockProxy<Git>

  const filePath = __dirname + '/' + 'package.json'
  const packageJson = `
{
  "name": "test",
  "description": "test",
  "version": "1.0.0",
  "author": "author",
  "dependencies": {
    "@actions/core": "^1.11.1"
  }
}
`
  beforeEach(() => {
    jest.clearAllMocks()
    git = mockDeep<Git>()
    nodeUpdateAction = new NodeUpdateAction(git)

    jest.mocked(core.info).mockImplementation(jest.fn())

    fs.writeFileSync(filePath, packageJson, 'utf-8')
    jest.mocked(path.resolve).mockReturnValue(filePath)
  })

  afterEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  })

  describe('run', () => {
    it('should update the version in package.json', async () => {
      const newVersion = '1.0.1'
      const inputs: Inputs = {
        runtime: 'dart',
        releaseTag: `v${newVersion}`,
        commitUserEmail: 'github-actions[bot]@users.noreply.github.com',
        commitUserName: 'github-actions[bot]',
        commitMessage: 'ci: updated package version'
      }

      await nodeUpdateAction.run(inputs)

      const updatedJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      expect(updatedJson['version']).toEqual(newVersion)
    })
  })
})
