import { execCommand } from './exec'

export class Git {
  static async setConfig(email: string, username: string) {
    await execCommand(`git config user.email "${email}"`)
    await execCommand(`git config user.name "${username}"`)
    await execCommand(
      `git remote set-url --push origin https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}`
    )
  }

  static async checkout(branch: string) {
    const branchName = this.getShortBranchName(branch)
    await execCommand(`git checkout -b ${branchName}`)
  }

  static async listStagedFiles() {
    await execCommand('git diff --cached --name-only')
  }

  static async addAllFiles() {
    await execCommand('git add --all')
  }

  static async commit(message: string) {
    await execCommand(`git commit -m "${message}"`)
  }

  static async push() {
    await execCommand(`git push`)
  }

  private static getShortBranchName(branch: string): string {
    if (branch.startsWith('refs/heads/')) {
      return branch.replace('refs/heads/', '')
    } else {
      return branch
    }
  }
}
