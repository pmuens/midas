require("dotenv").config();

const Web3 = require("web3");

const Kyber = require("./exchanges/kyber");
const Token = require("./classes/Token");
const contracts = require("./on-chain/contracts");

const web3 = new Web3(process.env.RPC_URL);

async function main() {
  const ctx = {
    web3,
    contracts,
  };

  const WETH = new Token(ctx, "WETH", contracts.mainnet.WETH, 18);
  const DAI = new Token(ctx, "DAI", contracts.mainnet.DAI, 18);

  const kyber = new Kyber(ctx);
  const kyberRate = await kyber.getRate(WETH, DAI, 2);

  console.log("Kyber:", kyberRate);
}

main();
