import { Base, Token } from '../classes'
import { Exchange } from '../interfaces'
import { Wei } from '../utils/types'

class UniswapV1 extends Base implements Exchange {
  async getRate(fromToken: Token, toToken: Token, amount: Wei): Promise<Wei> {
    if (fromToken.symbol !== 'ETH') {
      throw new Error('Uniswap v1 only allows to trade ETH -> X pairs')
    }
    const { utils, eth } = this.ctx.web3

    const { uniswapV1 } = this.ctx.contracts
    const factoryAbi = uniswapV1.factory.abi
    const factoryAddress = uniswapV1.factory.address
    const exchangeAbi = uniswapV1.exchange.abi
    const factoryContract = new eth.Contract(factoryAbi, factoryAddress)

    const exchangeAddress = await factoryContract.methods.getExchange(toToken.address).call()
    const exchangeContract = new eth.Contract(exchangeAbi, exchangeAddress)

    const result = await exchangeContract.methods.getEthToTokenInputPrice(amount).call()
    return utils.toBN(result)
  }
}

export default UniswapV1
