// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract ROSCA {
    uint256 public totalAmount;
    uint256 public actualTotalAmount; // After division among participants, might differ slightly since no floats
    uint256 public totalParticipants;
    uint256 public contributionAmount;
    uint256 public currentRound;

    struct Participant {
        address user;
        bool isAdmin;
        uint256 lastPaid;
    }

    mapping(address => Participant) public participants;
    address[] public participantList;

    struct Round {
        address recipient;        // Who receives the pool this round
        bool distributed;        // Whether the pool has been distributed
        mapping(address => bool) hasContributed; // Track who has contributed
        uint256 totalContributed; // Total amount contributed in this round
    }

    mapping(uint256 => Round) public rounds; // Round number => Round info

    // Events
    event ParticipantRegistered(address participant);
    event RoundStarted(uint256 roundNumber, address recipient);
    event ContributionMade(address participant, uint256 round, uint256 amount);
    event PoolDistributed(address recipient, uint256 round, uint256 amount);

    constructor(uint256 _totalParticipants, uint256 _totalAmount) payable {
        totalParticipants = _totalParticipants;
        totalAmount = _totalAmount;

        contributionAmount = totalAmount / totalParticipants;
        actualTotalAmount = contributionAmount * totalParticipants;

        require(msg.value == contributionAmount, "Invalid Contribution Amount");
        _addParticipant(msg.sender, true);

        rounds[0].recipient = msg.sender; // Owner gets first round (0)
        // Track owner's contribution for round 0
        _processContribution(msg.sender, msg.value);
    }

    function registerParticipant() public payable {
        require(!isParticipant(msg.sender), "User Already Registered");
        require(msg.value == contributionAmount, "Invalid Contribution Amount");
        require(participantList.length < totalParticipants, "Rosca is Full, All participants already registered");

        _addParticipant(msg.sender, false);
        _processContribution(msg.sender, msg.value);

        emit ParticipantRegistered(msg.sender);
    }

    function isParticipant(address user) private view returns (bool) {
        return participants[user].user != address(0); // Default value for address i.e. 0x0000000000000000000000000000000000000000
    }

    // Contribute to the current round
    function contribute() public payable {
        _processContribution(msg.sender, msg.value);
        emit ContributionMade(msg.sender, currentRound, msg.value);
    }

    // Distribute the pool for the current round
    function distributePool() public {
        require(isParticipant(msg.sender), "Not a registered participant");
        require(canClaimPool(msg.sender), "Cannot claim pool");

        rounds[currentRound].distributed = true;

        // Transfer the pool to the recipient
        (bool success, ) = payable(msg.sender).call{value: actualTotalAmount}("");
        require(success, "Transfer failed");

        emit PoolDistributed(msg.sender, currentRound, actualTotalAmount);

        // Only start next round if not in last round
        if (currentRound < totalParticipants - 1) {
            _startNextRound();
        }
        // Last round just gets marked as distributed, no round increment
    }

    // View function to check if user can claim the pool
    function canClaimPool(address user) public view returns (bool) {
        return currentRound < totalParticipants &&  // Check we haven't gone beyond last round
               rounds[currentRound].recipient == user &&
               rounds[currentRound].totalContributed == actualTotalAmount &&
               !rounds[currentRound].distributed;
    }

    // View function to check if user has contributed in current round
    function hasContributed(address user) public view returns (bool) {
        return rounds[currentRound].hasContributed[user];
    }

    function _addParticipant(address _addr,bool _isAdmin) private {
        participants[_addr] = Participant({
            user: _addr,
            isAdmin: _isAdmin,
            lastPaid: block.timestamp
        });
        participantList.push(_addr);
    }

    function _processContribution(address user, uint256 amount) private {
        require(isParticipant(user), "Not a registered participant");
        require(amount == contributionAmount, "Invalid contribution amount");
        require(!rounds[currentRound].hasContributed[user], "Already contributed this round");

        rounds[currentRound].hasContributed[user] = true;
        rounds[currentRound].totalContributed += amount;
    }

    // Internal function to start the next round
    function _startNextRound() private {
        currentRound++;
        address nextRecipient = participantList[currentRound];
        require(nextRecipient != address(0), "Invalid next recipient");

        rounds[currentRound].recipient = nextRecipient;
        emit RoundStarted(currentRound, nextRecipient);
    }
}
