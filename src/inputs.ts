import * as core from '@actions/core'

export function getActionInputs() {
  return {
    releaseTag: core.getInput('release_tag'),
    commitLockFile: core.getBooleanInput('commit_lock_file'),
    commitUserEmail: core.getInput('commit_user_email'),
    commitUserName: core.getInput('commit_user_name'),
    commitMessage: core.getInput('commit_message')
  }
}
