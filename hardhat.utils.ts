// tslint:disable: no-implicit-dependencies

import { join } from 'path'
import { readJSON } from 'fs-extra'

import deployments from './deployments'
import { getNetworkName } from './src/utils/infura'

export async function loadArtifact(sources: string, artifacts: string, name: string): Promise<any> {
  const projectRoot = __dirname
  const pathToContracts = sources.replace(projectRoot, '')
  return readJSON(join(artifacts, pathToContracts, `${name}.sol`, `${name}.json`))
}

export function loadDeployment(name: string): any {
  const network = getNetworkName(process.env.INFURA_URL as string).toLowerCase()
  return deployments[network][name]
}
