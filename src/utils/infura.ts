const networkToChainId: { [index: string]: number } = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GÖRLI: 5,
  KOVAN: 42
}

function extractInfo(infuraUrl: string): { [index: string]: any } {
  const regex = /https:\/\/(\w+)\.infura\.io\/v\d\/(.+)/
  const result = regex.exec(infuraUrl)
  const network: string = result![1]
  const projectId = result![2]
  const chainId = networkToChainId[network.toLocaleUpperCase()]
  return {
    network,
    projectId,
    chainId
  }
}

export function getNetworkName(infuraUrl: string): string {
  return extractInfo(infuraUrl).network
}

export function getChainId(infuraUrl: string): number {
  return extractInfo(infuraUrl).chainId
}

export function getProjectId(infuraUrl: string): number {
  return extractInfo(infuraUrl).projectId
}
