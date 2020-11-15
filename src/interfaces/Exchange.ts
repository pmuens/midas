import { Token } from '../classes'

interface Exchange {
  getRate(fromToken: Token, toToken: Token, amount: number): Promise<number>
}

export default Exchange
