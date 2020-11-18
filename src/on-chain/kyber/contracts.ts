import networkProxyAbi from './abi/network-proxy.json'

const contracts = {
  mainnet: {
    networkProxy: {
      address: '0x818E6FECD516Ecc3849DAf6845e3EC868087B755',
      abi: networkProxyAbi
    }
  },
  kovan: {
    networkProxy: {
      address: '0x692f391bCc85cefCe8C237C01e1f636BbD70EA4D',
      abi: networkProxyAbi
    }
  }
}

export default contracts
