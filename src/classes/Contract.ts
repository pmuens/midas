import Base from './Base'
import { Context } from '../utils/types'

class Contract extends Base {
  private _address: string

  constructor(ctx: Context, address: string) {
    super(ctx)
    this._address = address
  }

  get address(): string {
    return this.ctx.web3.utils.toChecksumAddress(this._address)
  }
}

export default Contract
