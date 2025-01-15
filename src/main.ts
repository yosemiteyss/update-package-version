import * as core from '@actions/core'
import * as path from 'path'
import { Git } from './git'
import { Npm } from './npm'
import { getActionInputs } from './inputs'

function parseReleaseTagToVersion(tag: string): string {
  const versionTagRegex = /^v\d+\.\d+\.\d+$/
  if (!versionTagRegex.test(tag)) {
    throw new Error('Invalid release tag, tag format must be vX.X.X')
  }
  return tag.replace('v', '')
}

export async function run(): Promise<void> {
  try {
    const inputs = getActionInputs()

    const version = parseReleaseTagToVersion(inputs.releaseTag)
    core.info(`[-] Parsed release tag to version: ${version}`)

    await Git.checkout(inputs.targetBranch)
    core.info(`[-] Checked out branch: ${inputs.targetBranch}`)

    const filePath = path.resolve(process.cwd(), 'package.json')
    const packageJson = Npm.readPackageJson(filePath)

    packageJson['version'] = version
    Npm.writePackageJson(filePath, packageJson)

    core.info(`[-] Updated package.json with new version`)

    await Git.setConfig(inputs.commitUserEmail, inputs.commitUserName)
    core.info(
      `[-] Updated git user: ${inputs.commitUserName} (${inputs.commitUserEmail})`
    )

    if (inputs.commitLockFile) {
      core.info('[-] Need to commit lock file. Start npm install...')
      await Npm.install()
    }

    core.info('[-] Commit:')
    await Git.addAllFiles()
    await Git.commit(`${inputs.commitMessage} ${version}`)

    core.info('[-] Push:')
    await Git.push(inputs.targetBranch)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`${error}`)
    }
  }
}
