import { Context } from '../utils/types'

class Token {
  private _ctx: Context
  private _symbol: string
  private _address: string
  private _decimals: number

  constructor(ctx: Context, symbol: string, address: string, decimals: number) {
    this._ctx = ctx
    this._symbol = symbol
    this._address = address
    this._decimals = decimals
  }

  get ctx(): Context {
    return this._ctx
  }

  get symbol(): string {
    return this._symbol.toUpperCase()
  }

  get address(): string {
    return this.ctx.web3.utils.toChecksumAddress(this._address)
  }

  get decimals(): number {
    return this._decimals
  }
}

export default Token
