# DeROSCA Usage Guide

This document contains technical details for interacting with the DeROSCA smart contract directly. For most users, we recommend using the web interface instead.

## Smart Contract Interaction

### Creating a New ROSCA

```solidity
// Example parameters
uint256 totalParticipants = 4;
uint256 totalAmount = 4 ether;
uint256 contributionAmount = totalAmount / totalParticipants; // 1 ether each

// Deploy contract and make first contribution
ROSCA rosca = new ROSCA{value: contributionAmount}(totalParticipants, totalAmount);
```

### Joining an Existing ROSCA

```solidity
// Register and make first contribution
rosca.registerParticipant{value: contributionAmount}();
```

### Making Contributions

```solidity
// Contribute to current round
rosca.contribute{value: contributionAmount}();
```

### Checking Status

```solidity
// Get current round status
(uint256 roundNumber,
 address recipient,
 uint256 totalContributed,
 uint256 targetAmount,
 bool isDistributed) = rosca.getCurrentRoundStatus();

// Check remaining contribution needed
uint256 remaining = rosca.getRemainingContribution();

// Check if user has contributed
bool hasContributed = rosca.hasContributed(userAddress);
```

## Contract Functions Reference

### View Functions

1. `getCurrentRoundStatus()`
   - Returns current round information
   - No parameters required
   - Returns: roundNumber, recipient, totalContributed, targetAmount, isDistributed

2. `getRemainingContribution()`
   - Returns amount still needed in current round
   - No parameters required
   - Returns: uint256 (amount in wei)

3. `hasContributed(address user)`
   - Checks if user has contributed in current round
   - Parameters: user address
   - Returns: boolean

4. `canClaimPool(address user)`
   - Checks if user can claim the pool
   - Parameters: user address
   - Returns: boolean

### State-Changing Functions

1. `registerParticipant()`
   - Joins ROSCA as new participant
   - Requires contribution amount in transaction
   - Emits: ParticipantRegistered

2. `contribute()`
   - Makes contribution for current round
   - Requires contribution amount in transaction
   - Emits: ContributionMade

3. `distributePool()`
   - Distributes pool to current round recipient
   - Only callable by current recipient
   - Emits: PoolDistributed
