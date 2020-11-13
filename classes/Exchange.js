class Exchange {
  constructor(ctx) {
    this._ctx = ctx
  }

  get ctx() {
    return this._ctx
  }

  async getRate(fromToken, toToken, amount) {
    throw new Error('Not Implemented...')
  }
}

module.exports = Exchange
