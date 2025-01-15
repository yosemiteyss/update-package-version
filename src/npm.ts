import { execCommand } from './exec'
import fs from 'fs'

export class Npm {
  static async install() {
    await execCommand('npm install')
  }

  static readPackageJson(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cannot find package.json in path: ${filePath}`)
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }

  static writePackageJson(filePath: string, content: any) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
  }
}
