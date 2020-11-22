import BN from 'bn.js'
import Web3 from 'web3'

export type Wei = BN

export interface Context {
  web3: Web3
  contracts: any
}
