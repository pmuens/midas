const kyberNetworkProxyAbi = require("./abi/kyber/network-proxy.json");

const contracts = {
  mainnet: {
    WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
    kyber: {
      networkProxy: {
        address: "0x818E6FECD516Ecc3849DAf6845e3EC868087B755",
        abi: kyberNetworkProxyAbi,
      },
    },
  },
};

module.exports = contracts;
