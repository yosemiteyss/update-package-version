import * as core from '@actions/core'

export interface Inputs {
  readonly runtime: string
  readonly releaseTag: string
  readonly commitUserEmail: string
  readonly commitUserName: string
  readonly commitMessage: string
}

export function getInputs(): Inputs {
  return {
    runtime: core.getInput('runtime'),
    releaseTag: core.getInput('release_tag'),
    commitUserEmail: core.getInput('commit_user_email'),
    commitUserName: core.getInput('commit_user_name'),
    commitMessage: core.getInput('commit_message')
  }
}
