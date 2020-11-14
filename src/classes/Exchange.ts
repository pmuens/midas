import Token from './Token'
import { Context } from '../utils/types'

class Exchange {
  private _ctx: Context

  constructor(ctx: Context) {
    this._ctx = ctx
  }

  get ctx(): Context {
    return this._ctx
  }

  async getRate(_fromToken: Token, _toToken: Token, _amount: number): Promise<number> {
    throw new Error('Not Implemented...')
  }
}

export default Exchange
