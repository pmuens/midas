import { Base, Token } from '../classes'
import { Exchange } from '../interfaces'

class UniswapV1 extends Base implements Exchange {
  async getRate(fromToken: Token, toToken: Token, amount: number): Promise<number> {
    if (fromToken.symbol !== 'ETH') {
      throw new Error('Uniswap v1 only allows to trade ETH -> X pairs')
    }
    const { utils, eth } = this.ctx.web3
    let amountInBN = utils.toBN(amount)
    amountInBN = utils.toWei(amountInBN, 'ether')

    const { uniswapV1 } = this.ctx.contracts
    const factoryAbi = uniswapV1.factory.abi
    const factoryAddress = uniswapV1.factory.address
    const exchangeAbi = uniswapV1.exchange.abi
    const factoryContract = new eth.Contract(factoryAbi, factoryAddress)

    const exchangeAddress = await factoryContract.methods.getExchange(toToken.address).call()

    const exchangeContract = new eth.Contract(exchangeAbi, exchangeAddress)

    const result = await exchangeContract.methods.getEthToTokenInputPrice(amountInBN).call()

    return parseFloat(utils.fromWei(result, 'ether'))
  }
}

export default UniswapV1
