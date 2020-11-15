import { Base, Token } from '../classes'
import { Exchange } from '../interfaces'

class Kyber extends Base implements Exchange {
  async getRate(fromToken: Token, toToken: Token, amount: number): Promise<number> {
    const { utils, eth } = this.ctx.web3
    const amountInBN = utils.toBN(utils.toWei(amount.toString()))

    const { kyber } = this.ctx.contracts
    const networkProxyAbi = kyber.networkProxy.abi
    const networkProxyAddress = kyber.networkProxy.address
    const networkProxyContract = new eth.Contract(networkProxyAbi, networkProxyAddress)

    const result = await networkProxyContract.methods
      .getExpectedRate(fromToken.address, toToken.address, amountInBN)
      .call()

    const amountInNum = parseFloat(utils.fromWei(amountInBN, 'ether'))
    return parseFloat(utils.fromWei(result.expectedRate, 'ether')) * amountInNum
  }
}

export default Kyber
