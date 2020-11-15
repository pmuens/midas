import { InfuraProvider } from '@ethersproject/providers'
import { Fetcher, Route, TokenAmount, TradeType, Trade, Token } from '@uniswap/sdk'

import { Base, Token as Towken } from '../classes'
import { Exchange } from '../interfaces'
import { getChainId, getProjectId } from '../utils/infura'

class UniswapV2 extends Base implements Exchange {
  async getRate(fromToken: Towken, toToken: Towken, amount: number): Promise<number> {
    const infuraUrl = process.env.INFURA_URL as string
    const chainId = getChainId(infuraUrl)
    const projectId = getProjectId(infuraUrl)

    const uniFromToken = new Token(chainId, fromToken.address, fromToken.decimals)
    const uniToToken = new Token(chainId, toToken.address, toToken.decimals)

    // NOTE: Apparently there's no way right now to inject our desired amount, rather
    // Uniswap always defaults to 1 unit
    const preparedAmount = this.ctx.web3.utils.toBN(10 ** fromToken.decimals).toString()

    const provider = new InfuraProvider(chainId, projectId)
    const pair = await Fetcher.fetchPairData(uniFromToken, uniToToken, provider)

    const route = new Route([pair], uniFromToken)
    const trade = new Trade(
      route,
      new TokenAmount(uniFromToken, preparedAmount),
      TradeType.EXACT_INPUT
    )

    return parseFloat(trade.executionPrice.toSignificant(6)) * amount
  }
}

export default UniswapV2
