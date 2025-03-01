import { execCommand } from './exec'

export class Git {
  async setConfig(email: string, username: string) {
    await execCommand(`git config user.email "${email}"`)
    await execCommand(`git config user.name "${username}"`)
    await execCommand(
      `git remote set-url --push origin https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}`
    )
  }

  async checkout(branch: string) {
    const branchName = this.getShortBranchName(branch)
    await execCommand(`git checkout -b ${branchName}`)
  }

  async listStagedFiles() {
    await execCommand('git diff --cached --name-only')
  }

  async addAllFiles() {
    await execCommand('git add --all')
  }

  async commit(message: string) {
    await execCommand(`git commit -m "${message}"`)
  }

  async push() {
    await execCommand(`git push`)
  }

  private getShortBranchName(branch: string): string {
    if (branch.startsWith('refs/heads/')) {
      return branch.replace('refs/heads/', '')
    } else {
      return branch
    }
  }
}
