// tslint:disable: no-implicit-dependencies

import '@nomiclabs/hardhat-web3'

import hre from 'hardhat'

import { loadArtifact, loadDeployment } from '../hardhat.utils'
import { loadContracts } from '../src/on-chain/contracts'

const GAS = 4000000
const { log, error } = console

const privateKey = process.env.PRIVATE_KEY as string
const { toBN, toWei } = hre.web3.utils
const { Contract, accounts } = hre.web3.eth
const { sources, artifacts } = hre.config.paths
const account = accounts.wallet.add(privateKey)

async function aaveFlashLoan(assetA: string, assetB: string, amount: number): Promise<string> {
  const UNISWAP_FACTORY_A_ADDRESS = '0xECc6C0542710a0EF07966D7d1B10fA38bbb86523'
  const UNISWAP_FACTORY_B_ADDRESS = '0x54Ac34e5cE84C501165674782582ADce2FDdc8F4'
  const context = hre.web3.eth.abi.encodeParameters(
    ['address', 'address'],
    [UNISWAP_FACTORY_A_ADDRESS, UNISWAP_FACTORY_B_ADDRESS]
  )
  const name = 'AaveFlashLoanUniswapV1'
  const { address } = await loadDeployment(name)
  const { abi } = await loadArtifact(sources, artifacts, name)

  const instance = new Contract(abi, address)
  const tx = await instance.methods
    .initFlashLoan(context, assetA, assetB, toBN(toWei(amount.toString())))
    .send({ from: account.address, gas: GAS })

  return tx.transactionHash
}

async function dydxFlashLoan(assetA: string, assetB: string, amount: number): Promise<string> {
  const DIRECTION = {
    KYBER_TO_UNISWAP_V2: 0,
    UNISWAP_V2_TO_KYBER: 1
  }
  const context = hre.web3.eth.abi.encodeParameters(
    ['address', 'uint256'],
    [account.address, DIRECTION.UNISWAP_V2_TO_KYBER]
  )
  const name = 'DyDxFlashLoan'
  const { address } = await loadDeployment(name)
  const { abi } = await loadArtifact(sources, artifacts, name)

  const instance = new Contract(abi, address)
  const tx = await instance.methods
    .initFlashLoan(context, assetA, assetB, toBN(toWei(amount.toString())))
    .send({ from: account.address, gas: GAS })

  return tx.transactionHash
}

async function main() {
  const contracts = loadContracts()

  let tx
  const amount = 1

  // --- AaveFlashLoanUniswapV1 ---
  tx = await aaveFlashLoan(contracts.tokens.DAI.address, contracts.tokens.BAT.address, amount)
  log(`"AaveFlashLoanUniswapV1" arbitrage succeeded: ${tx}`)

  // --- DyDxFlashLoan ---
  tx = await dydxFlashLoan(contracts.tokens.SAI.address, contracts.tokens.WETH.address, amount)
  log(`"DyDxFlashLoan" arbitrage succeeded: ${tx}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    error(err)
    process.exit(1)
  })
