import { Context } from '../utils/types'
import Contract from './Contract'

class Token extends Contract {
  private _symbol: string
  private _decimals: number

  constructor(ctx: Context, address: string, symbol: string, decimals: number) {
    super(ctx, address)
    this._symbol = symbol
    this._decimals = decimals
  }

  get symbol(): string {
    return this._symbol.toUpperCase()
  }

  get decimals(): number {
    return this._decimals
  }
}

export default Token
