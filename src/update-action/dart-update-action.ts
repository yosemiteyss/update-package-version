import { execCommand, Git } from '../common'
import path from 'path'
import fs from 'fs'
import yaml from 'yaml'
import * as core from '@actions/core'
import { UpdateAction } from './update-action'
import * as process from 'node:process'

export class DartUpdateAction extends UpdateAction {
  constructor(
    git: Git,
    private readonly isFlutter: boolean
  ) {
    super(git)
  }

  protected async updateVersion(version: string): Promise<void> {
    const filePath = path.resolve(process.cwd(), 'pubspec.yaml')
    const pubspecYaml = this.readPubspecYaml(filePath)

    pubspecYaml['version'] = version
    this.writePubspecYaml(filePath, pubspecYaml)

    core.info(`[-] Updated pubspec.yaml with version: ${version}`)
  }

  protected async updateLockFile(): Promise<void> {
    if (this.isFlutter) {
      await execCommand('flutter pub get')
    } else {
      await execCommand('dart pub get')
    }
  }

  private readPubspecYaml(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cannot find pubspec.yaml in path: ${filePath}`)
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return yaml.parse(fileContent)
  }

  private writePubspecYaml(filePath: string, content: any) {
    const yamlContent = yaml.stringify(content)
    fs.writeFileSync(filePath, yamlContent, 'utf-8')
  }
}
