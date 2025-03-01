import * as core from '@actions/core'
import { Inputs, Git } from '../common'

export abstract class UpdateAction {
  constructor(private readonly git: Git) {}

  protected abstract updateVersion(version: string): Promise<void>

  protected async updateLockFile(): Promise<void> {}

  async run(inputs: Inputs): Promise<void> {
    const version = this.parseReleaseTagToVersion(inputs.releaseTag)
    core.info(`[-] Parsed release tag to version: ${version}`)

    core.info('[-] Starting version update...')
    await this.updateVersion(version)

    await this.git.setConfig(inputs.commitUserEmail, inputs.commitUserName)
    core.info(
      `[-] Updated git user: ${inputs.commitUserName} (${inputs.commitUserEmail})`
    )

    core.info('[-] Updating lock file...')
    await this.updateLockFile()

    core.info('[-] Creating commit...')
    await this.git.addAllFiles()
    await this.git.commit(`${inputs.commitMessage} ${version}`)

    core.info('[-] Pushing commit...')
    await this.git.push()
  }

  private parseReleaseTagToVersion(tag: string): string {
    const versionTagRegex = /^v\d+\.\d+\.\d+$/
    if (!versionTagRegex.test(tag)) {
      throw new Error('Invalid release tag, tag format must be vX.X.X')
    }
    return tag.replace('v', '')
  }
}
