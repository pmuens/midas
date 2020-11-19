import aave from './aave/contracts'
import dydx from './dydx/contracts'
import kyber from './kyber/contracts'
import uniswapV1 from './uniswap-v1/contracts'
import uniswapV2 from './uniswap-v2/contracts'
import tokens from './tokens/contracts'
import { getNetworkName } from '../utils/infura'

const contracts: { [index: string]: any } = {
  mainnet: {
    aave: aave.mainnet,
    dydx: dydx.mainnet,
    kyber: kyber.mainnet,
    uniswapV1: uniswapV1.mainnet,
    uniswapV2: uniswapV2.mainnet,
    tokens: tokens.mainnet
  },
  kovan: {
    aave: aave.kovan,
    dydx: dydx.kovan,
    kyber: kyber.kovan,
    uniswapV1: uniswapV1.kovan,
    uniswapV2: uniswapV2.kovan,
    tokens: tokens.kovan
  }
}

export function loadContracts(network?: string): any {
  if (!network) {
    network = getNetworkName(process.env.INFURA_URL as string)
    network = network.toLowerCase()
  }

  return contracts[network]
}
