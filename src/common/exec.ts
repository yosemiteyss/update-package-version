import { promisify } from 'util'
import { exec } from 'child_process'
import * as core from '@actions/core'

const execPromise = promisify(exec)

/**
 * Execute command, and write output to logs.
 * @param command the command.
 */
export async function execCommand(command: string) {
  const output = await execPromise(command, {
    encoding: 'utf8',
    cwd: process.cwd()
  })

  core.info(output.stdout)

  if (output.stderr.length > 0) {
    core.error(output.stderr)
  }
}
