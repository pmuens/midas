import { CloudflareProvider } from '@ethersproject/providers'
import { ChainId, Fetcher, Route, TokenAmount, TradeType, Trade, Token } from '@uniswap/sdk'

import { default as Towken } from '../classes/Token'
import Exchange from '../classes/Exchange'

class UniswapV2 extends Exchange {
  async getRate(fromToken: Towken, toToken: Towken, amount: number): Promise<number> {
    const uniFromToken = new Token(ChainId.MAINNET, fromToken.address, fromToken.decimals)
    const uniToToken = new Token(ChainId.MAINNET, toToken.address, toToken.decimals)

    // NOTE: Apparently there's no way right now to inject our desired amount, rather
    // Uniswap always defaults to 1 unit
    const preparedAmount = this.ctx.web3.utils.toBN(10 ** fromToken.decimals).toString()

    const provider = new CloudflareProvider()
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
