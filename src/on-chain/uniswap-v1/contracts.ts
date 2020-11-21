import factoryAbi from './abi/factory.json'
import exchangeAbi from './abi/exchange.json'

const contracts = {
  factory: {
    address: '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95',
    abi: factoryAbi
  },
  exchange: {
    // Exchanges do not have specific addresses
    address: '0x0000000000000000000000000000000000000000',
    abi: exchangeAbi
  }
}

export default contracts
