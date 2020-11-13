const Exchange = require('../classes/Exchange')

class Kyber extends Exchange {
  async getRate(fromToken, toToken, amount) {
    const { utils, eth } = this.ctx.web3
    amount = utils.toBN(utils.toWei(amount.toString()))

    const { kyber } = this.ctx.contracts.mainnet
    const networkProxyAbi = kyber.networkProxy.abi
    const networkProxyAddress = kyber.networkProxy.address
    const networkProxyContract = new eth.Contract(networkProxyAbi, networkProxyAddress)

    const result = await networkProxyContract.methods
      .getExpectedRate(fromToken.address, toToken.address, amount)
      .call()

    amount = utils.fromWei(amount, 'ETHER')
    return parseFloat(utils.fromWei(result.expectedRate, 'ETHER') * amount)
  }
}

module.exports = Kyber
