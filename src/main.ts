import dotenv from 'dotenv'
dotenv.config()

import Web3 from 'web3'

import { Token } from './classes'
import { Context } from './utils/types'
import { getWebsocketUrl } from './utils/infura'
import contracts from './on-chain/contracts'
import { Kyber, UniswapV2 } from './exchanges'
import { updateEthPrice } from './utils/misc'

process.on('unhandledRejection', (error) => {
  // tslint:disable-next-line:no-console
  console.error(error)
})

const { toBN, toWei, fromWei } = Web3.utils

const httpProvider = new Web3.providers.HttpProvider('https://cloudflare-eth.com/')
const web3Http = new Web3(httpProvider)
const web3 = web3Http

const infuraWebsocketUrl = getWebsocketUrl(process.env.INFURA_PROJECT_ID as string)
const webSocketProvider = new Web3.providers.WebsocketProvider(infuraWebsocketUrl)
const web3Websocket = new Web3(webSocketProvider)

const { log } = console

async function main() {
  const ctx: Context = {
    web3,
    contracts
  }

  // Start monitoring the ETH price
  setInterval(() => updateEthPrice(ctx), 15000)
  setInterval(() => log(`Current ETH price: ~${ctx.ether?.toString()} USD`), 20000)

  const amount = toBN(toWei('2000'))

  const kyber = new Kyber(ctx)
  const uniswapV2 = new UniswapV2(ctx)

  const tokenA = new Token(ctx, contracts.tokens.DAI.address, 'DAI', 18)
  const tokenB = new Token(ctx, contracts.tokens.WETH.address, 'WETH', 18)

  web3Websocket.eth.subscribe('newBlockHeaders').on('data', async (block) => {
    log(`New block #${block.number}`)

    const [tokenBFromKyber, tokenBFromUniswapV2] = await Promise.all([
      kyber.getRate(tokenA, tokenB, amount),
      uniswapV2.getRate(tokenA, tokenB, amount)
    ])

    const [tokenAFromKyber, tokenAFromUniswapV2] = await Promise.all([
      kyber.getRate(tokenB, tokenA, tokenBFromUniswapV2),
      uniswapV2.getRate(tokenB, tokenA, tokenBFromKyber)
    ])

    log(
      `Kyber --> Uniswap v2 - ${tokenA.symbol} input / output: ${fromWei(amount)} / ${fromWei(
        tokenAFromUniswapV2
      )}`
    )
    log(
      `Uniswap v2 --> Kyber - ${tokenA.symbol} input / output: ${fromWei(amount)} / ${fromWei(
        tokenAFromKyber
      )}`
    )

    if (tokenAFromUniswapV2.gt(amount)) {
      log(`Getting more of ${tokenA.symbol} on Uniswap v2!`)
      log('Kyber --> Uniswap v2')
    }
    if (tokenAFromKyber.gt(amount)) {
      log(`Getting more of ${tokenA.symbol} on Kyber!`)
      log('Uniswap v2 --> Kyber')
    }
  })
}

main()
