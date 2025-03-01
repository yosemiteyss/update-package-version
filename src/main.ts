import * as core from '@actions/core'
import { getActionInputs, Git } from './common'
import {
  DartUpdateAction,
  NodeUpdateAction,
  UpdateAction
} from './update-action'

export async function run(): Promise<void> {
  try {
    const inputs = getActionInputs()
    const git = new Git()

    let updateAction: UpdateAction | undefined

    if (inputs.runtime === 'node') {
      updateAction = new NodeUpdateAction(git)
    } else if (inputs.runtime === 'dart') {
      updateAction = new DartUpdateAction(git, false)
    } else if (inputs.runtime === 'flutter') {
      updateAction = new DartUpdateAction(git, true)
    } else {
      throw new Error(`Unsupported runtime: ${inputs.runtime}`)
    }

    await updateAction.run(inputs)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`${error}`)
    }
  }
}
