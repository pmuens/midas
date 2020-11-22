import dotenv from 'dotenv'
dotenv.config()

import Web3 from 'web3'

import { Token } from './classes'
import { Context } from './utils/types'
import { getHttpUrl } from './utils/infura'
import contracts from './on-chain/contracts'
import { Kyber, UniswapV1, UniswapV2 } from './exchanges'
import { updateEthPrice } from './utils/misc'

process.on('unhandledRejection', (error) => {
  // tslint:disable-next-line:no-console
  console.error(error)
})

const infuraHttpUrl = getHttpUrl(process.env.INFURA_PROJECT_ID as string)
const provider = new Web3.providers.HttpProvider(infuraHttpUrl)
const web3 = new Web3(provider)

const { log } = console

async function main() {
  const ctx: Context = {
    web3,
    contracts
  }

  // Start monitoring the ETH price
  setInterval(() => updateEthPrice(ctx), 15000)
  setInterval(() => log(`Current ETH price: ~${ctx.ether?.toString()} USD`), 20000)

  const ETH = new Token(ctx, contracts.tokens.ETH.address, 'ETH', 18)
  const WETH = new Token(ctx, contracts.tokens.WETH.address, 'WETH', 18)
  const DAI = new Token(ctx, contracts.tokens.DAI.address, 'DAI', 18)

  const kyber = new Kyber(ctx)
  const kyberRate = await kyber.getRate(WETH, DAI, 2)

  const uniswapV1 = new UniswapV1(ctx)
  const uniswapV1Rate = await uniswapV1.getRate(ETH, DAI, 2)

  const uniswapV2 = new UniswapV2(ctx)
  const uniswapV2Rate = await uniswapV2.getRate(WETH, DAI, 2)

  log('Kyber:', web3.utils.fromWei(kyberRate))
  log('Uniswap (v1):', web3.utils.fromWei(uniswapV1Rate))
  log('Uniswap (v2):', web3.utils.fromWei(uniswapV2Rate))
}

main()
