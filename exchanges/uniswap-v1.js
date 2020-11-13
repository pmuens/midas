const Exchange = require("../classes/Exchange");

class UniswapV1 extends Exchange {
  async getRate(fromToken, toToken, amount) {
    if (fromToken.symbol !== "ETH") {
      throw new Error("Uniswap v1 only allows to trade ETH -> X pairs");
    }
    const { utils, eth } = this.ctx.web3;
    amount = utils.toBN(amount);
    amount = utils.toWei(amount, "ETHER");

    const { uniswapV1 } = this.ctx.contracts.mainnet;
    const factoryAbi = uniswapV1.factory.abi;
    const factoryAddress = uniswapV1.factory.address;
    const exchangeAbi = uniswapV1.exchange.abi;
    const factoryContract = new eth.Contract(factoryAbi, factoryAddress);

    const exchangeAddress = await factoryContract.methods
      .getExchange(toToken.address)
      .call();

    const exchangeContract = new eth.Contract(exchangeAbi, exchangeAddress);

    const result = await exchangeContract.methods
      .getEthToTokenInputPrice(amount)
      .call();

    return parseFloat(utils.fromWei(result, "ETHER"));
  }
}

module.exports = UniswapV1;
