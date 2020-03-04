import { exec } from '../utils/exec'

export async function current_commit() {
  const r = await exec('git rev-parse HEAD')
  return r.data.toString('utf-8').trim()
}