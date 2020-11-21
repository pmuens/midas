// tslint:disable: no-implicit-dependencies

import { join } from 'path'
import { readJSON } from 'fs-extra'

import deployments from './deployments'

export async function loadArtifact(sources: string, artifacts: string, name: string): Promise<any> {
  const projectRoot = __dirname
  const pathToContracts = sources.replace(projectRoot, '')
  return readJSON(join(artifacts, pathToContracts, `${name}.sol`, `${name}.json`))
}

export function loadDeployment(name: string): any {
  return deployments[name]
}
