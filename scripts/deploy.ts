// tslint:disable: no-implicit-dependencies

import '@nomiclabs/hardhat-web3'

import hre from 'hardhat'

import { loadArtifact } from '../hardhat.utils'
import { loadContracts } from '../src/on-chain/contracts'

const GAS = 4000000
const { log, error } = console

const privateKey = process.env.PRIVATE_KEY as string
const { accounts } = hre.web3.eth
const account = accounts.wallet.add(privateKey)

async function deployContract(deployer: string, name: string, args: string[]): Promise<string> {
  const { sources, artifacts } = hre.config.paths
  const { abi, bytecode } = await loadArtifact(sources, artifacts, name)
  const instance = new hre.web3.eth.Contract(abi)
  return new Promise((resolve, reject) => {
    return instance
      .deploy({
        data: bytecode,
        arguments: args
      })
      .send({
        from: deployer,
        gas: GAS
      })
      .then((result) => {
        resolve(result.options.address)
      })
      .catch((err) => reject(err))
  })
}

async function aaveFlashLoan(contracts: any): Promise<string> {
  const name = 'AaveFlashLoan'
  const aaveLendingPoolAddressesProvider = contracts.aave.lendingPoolAddressesProvider.address
  const kyberNetworkProxy = contracts.kyber.networkProxy.address
  const uniswapV2Router02 = contracts.uniswapV2.router02.address
  return deployContract(account.address, name, [
    aaveLendingPoolAddressesProvider,
    kyberNetworkProxy,
    uniswapV2Router02
  ])
}

async function dydxFlashLoan(contracts: any): Promise<string> {
  const name = 'DyDxFlashLoan'
  const dydxSoloMargin = contracts.dydx.soloMargin.address
  const kyberNetworkProxy = contracts.kyber.networkProxy.address
  const uniswapV2Router02 = contracts.uniswapV2.router02.address
  return deployContract(account.address, name, [
    dydxSoloMargin,
    kyberNetworkProxy,
    uniswapV2Router02
  ])
}

async function main() {
  const contracts = loadContracts()

  let address

  // --- AaveFlashLoan ---
  address = await aaveFlashLoan(contracts)
  log(`Deployed "AaveFlashLoan" at ${address}`)

  // --- DyDxFlashLoan ---
  address = await dydxFlashLoan(contracts)
  log(`Deployed "DyDxFlashLoan" at ${address}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    error(err)
    process.exit(1)
  })
