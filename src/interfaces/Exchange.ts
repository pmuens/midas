import { Token } from '../classes'
import { Wei } from '../utils/types'

interface Exchange {
  getRate(fromToken: Token, toToken: Token, amount: Wei): Promise<Wei>
}

export default Exchange
