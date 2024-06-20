import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    baseTestnet: {
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532,
    },
    //   mumbai_testnet: {
    //     url: "https://rpc-mumbai.maticvigil.com", //URL of the RPC node for mumbai
    //     accounts: [process.env.PRIVATE_KEY], //Your private key starting with "0x"
    //     //Make sure you have enough funds in this wallet to deploy the smart contract
    //   },
  },
  etherscan: {
    apiKey: {
      baseTestnet: process.env.BASESCAN_API_KEY,
    },
    customChains: [
    {
      network: "baseTestnet",
      chainId: 84532,
      urls: {
        apiURL: "https://api-sepolia.basescan.org/api",
        browserURL: "https://sepolia.basescan.org/"
      }
    }
  ]
  }
};

export default config;
