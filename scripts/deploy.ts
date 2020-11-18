// tslint:disable: no-implicit-dependencies

import '@nomiclabs/hardhat-web3'

import hre from 'hardhat'

import { loadArtifact } from '../hardhat.utils'
import { loadContracts } from '../src/on-chain/contracts'

const GAS = 4000000
const { log, error } = console

const privateKey = process.env.PRIVATE_KEY as string

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

async function main() {
  const { accounts } = hre.web3.eth
  const account = accounts.wallet.add(privateKey)
  const contracts = loadContracts()

  // --- AaveFlashLoanUniswapV1 ---
  const name = 'AaveFlashLoanUniswapV1'
  const addressProvider = contracts.aave.lendingPoolAddressesProvider.address
  const address = await deployContract(account.address, name, [addressProvider])

  log(`Deployed "${name}" at ${address}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    error(err)
    process.exit(1)
  })