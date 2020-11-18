// tslint:disable:no-submodule-imports no-implicit-dependencies
import { HardhatUserConfig } from 'hardhat/types'

import '@nomiclabs/hardhat-web3'
import dotenv from 'dotenv'

dotenv.config()

const cache = './cache'
const artifacts = './artifacts'
const tests = './src/tests'
const sources = './src/contracts'

const infuraProjectId = (process.env.INFURA_URL as string).split('/').pop()
const privateKey = process.env.PRIVATE_KEY as string

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    kovan: {
      url: `https://kovan.infura.io/v3/${infuraProjectId}`,
      accounts: [privateKey]
    }
  },
  solidity: {
    compilers: [
      {
        version: '0.6.12'
      }
    ]
  },
  paths: {
    sources,
    tests,
    cache,
    artifacts
  }
}

export default config
