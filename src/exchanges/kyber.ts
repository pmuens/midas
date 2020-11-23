import { Base, Token } from '../classes'
import { Exchange } from '../interfaces'
import { ONE_WEI } from '../utils/constants'
import { Wei } from '../utils/types'

class Kyber extends Base implements Exchange {
  async getRate(fromToken: Token, toToken: Token, amount: Wei): Promise<Wei> {
    const { utils, eth } = this.ctx.web3

    const { kyber } = this.ctx.contracts
    const networkProxyAbi = kyber.networkProxy.abi
    const networkProxyAddress = kyber.networkProxy.address
    const networkProxyContract = new eth.Contract(networkProxyAbi, networkProxyAddress)

    const result = await networkProxyContract.methods
      .getExpectedRate(fromToken.address, toToken.address, amount)
      .call()
    return amount.mul(utils.toBN(result.expectedRate)).div(ONE_WEI)
  }
}

export default Kyber
