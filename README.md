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

> **Note**: This is a test implementation. Deploying and interacting with the contract on mainnet will incur gas fees for all operations (deployment, registration, pool distribution).

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

1. **Start a local Hardhat node** (in a separate terminal):
   ```bash
   npx hardhat node
   ```

2. **Deploy the contract** using the existing Ignition module:
   ```bash
   npx hardhat ignition deploy ignition/modules/RoscaModule.ts --network localhost
   ```
   Note the deployed contract address from the output.

### Contract Interaction

1. **Start the Hardhat console**:
   ```bash
   npx hardhat console --network localhost
   ```

2. **Example interactions**:
   ```javascript
   // Import parseEther from viem
   const { parseEther } = await import('viem')

   // Get contract instance
   const rosca = await hre.viem.getContractAt("ROSCA", "DEPLOYED_CONTRACT_ADDRESS")

   // Check contract state
   await rosca.read.totalParticipants()
   await rosca.read.currentRound()
   await rosca.read.contributionAmount()

   // Check status
   await rosca.read.getCurrentRoundStatus()

   // Get test accounts
   const [owner, participant1, participant2, participant3] = await hre.viem.getWalletClients()

   // Register participants (each requires 1 ETH)
   // First participant (owner is already registered during deployment)
   await rosca.write.registerParticipant({
     account: participant1.account,
     value: parseEther("1")
   })

   // Check status
   await rosca.read.getCurrentRoundStatus()

   // Second participant
   await rosca.write.registerParticipant({
     account: participant2.account,
     value: parseEther("1")
   })

   // Check status
   await rosca.read.getCurrentRoundStatus()

   // Third participant
   await rosca.write.registerParticipant({
     account: participant3.account,
     value: parseEther("1")
   })

   // Check status
   await rosca.read.getCurrentRoundStatus()

   // Distribute pool (only by current round recipient)
   await rosca.write.distributePool()
   ```

Note: Replace `DEPLOYED_CONTRACT_ADDRESS` with the actual address from deployment.

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
