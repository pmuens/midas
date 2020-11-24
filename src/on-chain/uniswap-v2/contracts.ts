import router01Abi from './abi/router01.json'
import router02Abi from './abi/router02.json'

const contracts = {
  router01: {
    address: '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a',
    abi: router01Abi
  },
  router02: {
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    abi: router02Abi
  }
}

export default contracts
