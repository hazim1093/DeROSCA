import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
require("@nomiclabs/hardhat-solhint");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("solidity-coverage");

const config: HardhatUserConfig = {
  solidity: "0.8.30",
};

export default config;
