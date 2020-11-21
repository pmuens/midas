// tslint:disable: no-implicit-dependencies

import { join } from 'path'
import { readJSON, writeJSON, ensureDir } from 'fs-extra'

const deploymentsDirPath = join(__dirname, 'deployments')

export async function loadArtifact(sources: string, artifacts: string, name: string): Promise<any> {
  const projectRoot = __dirname
  const pathToContracts = sources.replace(projectRoot, '')
  return readJSON(join(artifacts, pathToContracts, `${name}.sol`, `${name}.json`))
}

export async function saveDeployment(name: string, address: string): Promise<string> {
  await ensureDir(deploymentsDirPath)
  const filePath = join(deploymentsDirPath, `${name}.json`)
  await writeJSON(filePath, {
    address
  })
  return filePath
}

export async function loadDeployment(name: string): Promise<any> {
  return readJSON(join(deploymentsDirPath, `${name}.json`))
}
