import { Base, Token } from '../classes'
import { Exchange } from '../interfaces'
import { Wei } from '../utils/types'

class UniswapV2 extends Base implements Exchange {
  async getRate(fromToken: Token, toToken: Token, amount: Wei): Promise<Wei> {
    const { utils, eth } = this.ctx.web3

    const { uniswapV2 } = this.ctx.contracts
    const router02Address = uniswapV2.router02.address
    const router02Abi = uniswapV2.router02.abi
    const router02Contract = new eth.Contract(router02Abi, router02Address)

    const path = [fromToken.address, toToken.address]
    const result = await router02Contract.methods.getAmountsOut(amount, path).call()
    return utils.toBN(result[1])
  }
}

export default UniswapV2
