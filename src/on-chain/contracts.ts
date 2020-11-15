import kyber from './kyber/contracts'
import uniswapV1 from './uniswap-v1/contracts'
import tokens from './tokens/contracts'
import { getNetworkName } from '../utils/infura'

const contracts: { [index: string]: any } = {
  mainnet: {
    kyber: kyber.mainnet,
    uniswapV1: uniswapV1.mainnet,
    tokens: tokens.mainnet
  }
}

export function loadContracts(network?: string): any {
  if (!network) {
    network = getNetworkName(process.env.INFURA_URL as string)
    network = network.toLowerCase()
  }

  return contracts[network]
}
