import fs from 'fs'
import path from 'path'
import { DartUpdateAction } from '../../src/update-action'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { Git, Inputs } from '../../src/common'
import * as core from '@actions/core'
import yaml from 'yaml'

jest.mock('path')
jest.mock('@actions/core')

describe('DartUpdateAction', () => {
  let dartUpdateAction: DartUpdateAction
  let git: DeepMockProxy<Git>

  const filePath = __dirname + '/' + 'pubspec.yaml'
  const pubspecYamlTemplate = `
name: test
description: test
publish_to: none
version: 1.0.0

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  `

  beforeEach(() => {
    jest.clearAllMocks()
    git = mockDeep<Git>()
    dartUpdateAction = new DartUpdateAction(git)

    jest.mocked(core.info).mockImplementation(jest.fn())

    fs.writeFileSync(filePath, pubspecYamlTemplate, 'utf-8')
    jest.mocked(path.resolve).mockReturnValue(filePath)
  })

  afterEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  })

  describe('run', () => {
    it('should update the version in pubspec.yaml', async () => {
      const newVersion = '1.0.1'
      const inputs: Inputs = {
        runtime: 'dart',
        releaseTag: `v${newVersion}`,
        commitUserEmail: 'github-actions[bot]@users.noreply.github.com',
        commitUserName: 'github-actions[bot]',
        commitMessage: 'ci: updated package version'
      }

      await dartUpdateAction.run(inputs)

      const updatedYaml = yaml.parse(fs.readFileSync(filePath, 'utf-8'))
      expect(updatedYaml['version']).toEqual(newVersion)
    })
  })
})
