import { Context } from '../utils/types'

class Base {
  private _ctx: Context

  constructor(ctx: Context) {
    this._ctx = ctx
  }

  get ctx(): Context {
    return this._ctx
  }
}

export default Base
