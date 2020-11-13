class Token {
  constructor(ctx, symbol, address, decimals) {
    this._ctx = ctx;
    this._symbol = symbol;
    this._address = address;
    this._decimals = decimals;
  }

  get ctx() {
    return this._ctx;
  }

  get symbol() {
    return this._symbol.toUpperCase();
  }

  get address() {
    return this.ctx.web3.utils.toChecksumAddress(this._address);
  }

  get decimals() {
    return this._decimals;
  }
}

module.exports = Token;
