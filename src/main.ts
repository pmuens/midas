import dotenv from 'dotenv'
dotenv.config()

import Web3 from 'web3'

import { Token } from './classes'
import { Context } from './utils/types'
import { loadContracts } from './on-chain/contracts'
import { Kyber, UniswapV1, UniswapV2 } from './exchanges'

const provider = new Web3.providers.HttpProvider(process.env.INFURA_URL as string)
const web3 = new Web3(provider)

const { log } = console

async function main() {
  const contracts = loadContracts()
  const ctx: Context = {
    web3,
    contracts
  }

  const { tokens } = contracts
  const ETH = new Token(ctx, tokens.ETH.address, 'ETH', 18)
  const WETH = new Token(ctx, tokens.WETH.address, 'WETH', 18)
  const DAI = new Token(ctx, tokens.DAI.address, 'DAI', 18)

  const kyber = new Kyber(ctx)
  const kyberRate = await kyber.getRate(WETH, DAI, 2)

  const uniswapV1 = new UniswapV1(ctx)
  const uniswapV1Rate = await uniswapV1.getRate(ETH, DAI, 2)

  const uniswapV2 = new UniswapV2(ctx)
  const uniswapV2Rate = await uniswapV2.getRate(WETH, DAI, 2)

  log('Kyber:', kyberRate)
  log('Uniswap (v1):', uniswapV1Rate)
  log('Uniswap (v2):', uniswapV2Rate)
}

main()
