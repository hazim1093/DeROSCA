# DeROSCA
Decentralized ROSCA (Rotating Savings and Credit Association) on Ethereum. Traditional community savings re-imagined for Web3.

[![CI Status](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml/badge.svg)](https://github.com/hazim1093/DeROSCA/actions/workflows/ci.yml)

## What is ROSCA?
A group savings system where members contribute periodically and take turns receiving the pool. Known globally as Tandas 🇲🇽, Susu 🌍, Kameti 🇵🇰, Hui 🇨🇳, Chit Fund 🇮🇳.

## Why Web3 ROSCA?
- 🔐 **Trustless**: Smart contracts ensure fair distribution
- 🌐 **Global**: Permissionless participation
- 🔍 **Transparent**: On-chain verification
- 🤝 **Decentralized**: No intermediaries

## Technical Stack

- **Smart Contracts**: Solidity 0.8.x
- **Development Framework**: Hardhat 👷
- **Security**: Slither Analyzer 🐍
- **Deployment**: Hardhat Ignition 👷
- **Network**: Ethereum (Compatible with all EVM networks)
- **Web Interface**: "Vibe coding" based on [Lovable](https://lovable.dev) 🪄

## How it Works

1. **Setup**
   - ROSCA Creator (Admin):
     - Set participant count & total pool amount
     - Pays initial contribution

2. **Participation**
   - Participants join an existing ROSCA contract
   - Each participant contributes an equal amount

3. **Rounds**
   - Each round has one designated recipient
   - All participants must contribute before pool distribution
   - Recipients rotate in order of registration
   - Contract manages contribution tracking and distribution

## Features

- ✅ Fixed number of participants
- ✅ Equal contribution amounts
- ✅ Automatic recipient rotation
- ✅ Contribution tracking
- ✅ Secure pool distribution
- ✅ View functions for contract status

## Development

### Setup

1. **Prerequisites**
   ```sh
   npm install
   ```

2. **Compile Contracts**
   ```sh
   npx hardhat compile
   ```

3. **Run Tests**
   ```sh
   npx hardhat test
   ```

### Deployment

1. **Local Development**
   ```sh
   # Start local node
   npx hardhat node

   # Deploy contract
   npx hardhat ignition deploy ./ignition/modules/Rosca.ts --network localhost
   ```

2. **Testing Networks**
   ```sh
   # Deploy to testnet (e.g., Sepolia)
   npx hardhat ignition deploy ./ignition/modules/Rosca.ts --network sepolia
   ```

### Security Analysis

- Make sure Slither is installed
  ```sh
  pip3 install slither-analyzer
  ```
- Run Slither
  ```sh
  slither .
  ```

## Documentation
- [Usage Guide](USAGE.md) - Guide for Smart contract interaction
- [Web Interface](https://) - Web interface (Coming Soon)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
