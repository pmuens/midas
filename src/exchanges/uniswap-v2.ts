import { InfuraProvider } from '@ethersproject/providers'
import { Fetcher, Route, TokenAmount, TradeType, Trade, Token } from '@uniswap/sdk'

import { Base, Token as Towken } from '../classes'
import { Exchange } from '../interfaces'
import { getChainId, getProjectId } from '../utils/infura'
import { Wei } from '../utils/types'

class UniswapV2 extends Base implements Exchange {
  async getRate(fromToken: Towken, toToken: Towken, amount: number): Promise<Wei> {
    const { utils } = this.ctx.web3
    const infuraUrl = process.env.INFURA_URL as string
    const chainId = getChainId(infuraUrl)
    const projectId = getProjectId(infuraUrl)
    const amountInBN = utils.toBN(amount)

    const uniFromToken = new Token(chainId, fromToken.address, fromToken.decimals)
    const uniToToken = new Token(chainId, toToken.address, toToken.decimals)

    const preparedAmount = amountInBN.mul(utils.toBN(10 ** fromToken.decimals)).toString()

    const provider = new InfuraProvider(chainId, projectId)
    const pair = await Fetcher.fetchPairData(uniToToken, uniFromToken, provider)

    const route = new Route([pair], uniFromToken)
    const trade = new Trade(
      route,
      new TokenAmount(uniFromToken, preparedAmount),
      TradeType.EXACT_INPUT
    )

    return amountInBN.mul(
      utils.toBN(utils.toWei(trade.executionPrice.toSignificant(fromToken.decimals)))
    )
  }
}

export default UniswapV2
