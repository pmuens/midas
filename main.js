require('dotenv').config()

const Web3 = require('web3')

const Kyber = require('./exchanges/kyber')
const UniswapV1 = require('./exchanges/uniswap-v1')
const UniswapV2 = require('./exchanges/uniswap-v2')
const Token = require('./classes/Token')
const contracts = require('./on-chain/contracts')

const web3 = new Web3(process.env.RPC_URL)

async function main() {
  const ctx = {
    web3,
    contracts
  }

  const ETH = new Token(ctx, 'ETH', contracts.mainnet.ETH, 18)
  const WETH = new Token(ctx, 'WETH', contracts.mainnet.WETH, 18)
  const DAI = new Token(ctx, 'DAI', contracts.mainnet.DAI, 18)

  const kyber = new Kyber(ctx)
  const kyberRate = await kyber.getRate(WETH, DAI, 2)

  const uniswapV1 = new UniswapV1(ctx)
  const uniswapV1Rate = await uniswapV1.getRate(ETH, DAI, 2)

  const uniswapV2 = new UniswapV2(ctx)
  const uniswapV2Rate = await uniswapV2.getRate(WETH, DAI, 2)

  console.log('Kyber:', kyberRate)
  console.log('Uniswap (v1):', uniswapV1Rate)
  console.log('Uniswap (v2):', uniswapV2Rate)
}

main()
