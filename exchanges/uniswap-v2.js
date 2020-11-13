const { CloudflareProvider } = require("@ethersproject/providers");
const {
  ChainId,
  Fetcher,
  Route,
  TokenAmount,
  TradeType,
  Trade,
  Token,
} = require("@uniswap/sdk");

const Exchange = require("../classes/Exchange");

class UniswapV2 extends Exchange {
  async getRate(fromToken, toToken, amount) {
    let uniFromToken = fromToken;
    let uniToToken = toToken;

    uniFromToken = new Token(
      ChainId.MAINNET,
      fromToken.address,
      fromToken.decimals
    );
    uniToToken = new Token(ChainId.MAINNET, toToken.address, toToken.decimals);

    // NOTE: Apparently there's no way right now to inject our desired amount, rather
    // Uniswap always defaults to 1 unit
    const preparedAmount = this.ctx.web3.utils
      .toBN(10 ** fromToken.decimals)
      .toString();

    const provider = new CloudflareProvider();
    const pair = await Fetcher.fetchPairData(
      uniFromToken,
      uniToToken,
      provider
    );

    const route = new Route([pair], uniFromToken);
    const trade = new Trade(
      route,
      new TokenAmount(uniFromToken, preparedAmount),
      TradeType.EXACT_INPUT
    );

    return parseFloat(trade.executionPrice.toSignificant(6) * amount);
  }
}

module.exports = UniswapV2;
