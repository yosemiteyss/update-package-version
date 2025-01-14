import * as core from '@actions/core'
import * as path from 'path'
import * as fs from 'fs'
import { execSync } from 'child_process'

function getActionInputs() {
  return {
    releaseTag: core.getInput('release_tag'),
    commitLockFile: core.getBooleanInput('commit_lock_file'),
    commitUserEmail: core.getInput('commit_user_email'),
    commitUserName: core.getInput('commit_user_name'),
    commitMessage: core.getInput('commit_message'),
    commitTagPrefix: core.getInput('commit_tag_prefix')
  }
}

function parseReleaseTagToVersion(tag: string): string {
  const versionTagRegex = /^v\d+\.\d+\.\d+$/
  if (!versionTagRegex.test(tag)) {
    throw new Error('Invalid release tag, tag format must be vX.X.X')
  }
  return tag.replace('v', '')
}

function readPackageJson() {
  const filePath = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cannot find package.json in path: ${filePath}`)
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function execSyncWithLog(command: string) {
  core.info(execSync(command, { encoding: 'utf8' }))
}

export async function run(): Promise<void> {
  try {
    const inputs = getActionInputs()
    const version = parseReleaseTagToVersion(inputs.releaseTag)

    const packageJson = readPackageJson()
    packageJson['version'] = version
    fs.writeFileSync(packageJson, JSON.stringify(packageJson, null, 2), 'utf-8')

    execSyncWithLog(`git config user.email "${inputs.commitUserEmail}"`)
    core.info(`Updated git email: ${inputs.commitUserEmail}`)

    execSyncWithLog(`git config user.name "${inputs.commitUserName}"`)
    core.info(`Updated git username: ${inputs.commitUserName}`)

    if (inputs.commitLockFile) {
      core.info('Need to commit lock file. Start npm install:')
      execSyncWithLog('npm install')
    }

    core.info('Staged files:')
    execSyncWithLog('git diff --cached --name-only')
    execSyncWithLog('git add --all')

    core.info('Commit:')
    execSyncWithLog(`git commit -m "${inputs.commitMessage} ${version}"`)
    execSyncWithLog(`git tag ${inputs.commitTagPrefix}_${version}`)

    core.info('Push:')
    execSyncWithLog(
      `git remote set-url --push origin https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}`
    )
    execSyncWithLog(`git push --tags`)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`${error}`)
    }
  }
}
