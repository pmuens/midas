const kyberNetworkProxyAbi = require('./abi/kyber/network-proxy.json')
const uniswapV1FactoryAbi = require('./abi/uniswap-v1/factory.json')
const uniswapV1ExchangeAbi = require('./abi/uniswap-v1/exchange.json')

const contracts = {
  mainnet: {
    ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    kyber: {
      networkProxy: {
        address: '0x818E6FECD516Ecc3849DAf6845e3EC868087B755',
        abi: kyberNetworkProxyAbi
      }
    },
    uniswapV1: {
      factory: {
        address: '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95',
        abi: uniswapV1FactoryAbi
      },
      exchange: {
        address: '0x09cabEC1eAd1c0Ba254B09efb3EE13841712bE14',
        abi: uniswapV1ExchangeAbi
      }
    }
  }
}

module.exports = contracts
