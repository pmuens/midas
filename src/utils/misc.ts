import Web3 from 'web3'

import { Kyber } from '../exchanges'
import { Token } from '../classes'
import { Wei, Context } from './types'
import { ONE_WEI } from './constants'
import contracts from '../on-chain/contracts'

export async function updateEthPrice(ctx: Context): Promise<Wei> {
  // NOTE: Using DAI here since it represents $1
  const ETH = new Token(ctx, contracts.tokens.ETH.address, 'ETH', 18)
  const DAI = new Token(ctx, contracts.tokens.DAI.address, 'DAI', 18)

  const kyber = new Kyber(ctx)
  const result = await kyber.getRate(ETH, DAI, 1)
  const priceInWei = Web3.utils.toBN('1').mul(result)
  ctx.ether = priceInWei.div(ONE_WEI)
  return priceInWei
}
