import factoryAbi from './abi/factory.json'
import exchangeAbi from './abi/exchange.json'

const contracts = {
  mainnet: {
    factory: {
      address: '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95',
      abi: factoryAbi
    },
    exchange: {
      address: '0x09cabEC1eAd1c0Ba254B09efb3EE13841712bE14',
      abi: exchangeAbi
    }
  }
}

export default contracts
