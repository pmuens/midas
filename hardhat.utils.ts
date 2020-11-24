// tslint:disable: no-implicit-dependencies

import { join } from 'path'
import { readJSON, writeJSON, ensureDir } from 'fs-extra'

export const cache = join(__dirname, 'cache')
export const artifacts = join(__dirname, 'artifacts')
export const tests = join(__dirname, 'src', 'tests')
export const sources = join(__dirname, 'src', 'contracts')
export const deployments = join(__dirname, 'deployments')

export async function loadArtifact(sources: string, artifacts: string, name: string): Promise<any> {
  const projectRoot = __dirname
  const pathToContracts = sources.replace(projectRoot, '')
  return readJSON(join(artifacts, pathToContracts, `${name}.sol`, `${name}.json`))
}

export async function saveDeployment(name: string, address: string): Promise<string> {
  await ensureDir(deployments)
  const filePath = join(deployments, `${name}.json`)
  await writeJSON(filePath, {
    address
  })
  return filePath
}

export async function loadDeployment(name: string): Promise<any> {
  return readJSON(join(deployments, `${name}.json`))
}
