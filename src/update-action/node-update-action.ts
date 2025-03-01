import { execCommand } from '../common'
import path from 'path'
import fs from 'fs'
import * as core from '@actions/core'
import { UpdateAction } from './update-action'

export class NodeUpdateAction extends UpdateAction {
  protected async updateVersion(version: string): Promise<void> {
    const filePath = path.resolve(process.cwd(), 'package.json')
    const packageJson = this.readPackageJson(filePath)

    packageJson['version'] = version
    this.writePackageJson(filePath, packageJson)

    core.info(`[-] Updated package.json with version: ${version}`)
  }

  protected async updateLockFile(): Promise<void> {
    await execCommand('npm install')
  }

  private readPackageJson(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cannot find package.json in path: ${filePath}`)
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }

  private writePackageJson(filePath: string, content: any) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
  }
}
