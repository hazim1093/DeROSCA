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

        require(msg.value == contributionAmount, "Invalid Contribution Amount, w.r.t the total amount");
        _addParticipant(msg.sender, true);

        // Initialize first round
        currentRound = 1;
        rounds[currentRound].recipient = msg.sender; // First contributor gets first round
    }

    function registerParticipant() public payable {
        require(!isParticipant(msg.sender), "User Already Registered");
        require(msg.value == contributionAmount, "Invalid Contribution Amount");

        _addParticipant(msg.sender, false);

        emit ParticipantRegistered(msg.sender);
    }

    function isParticipant(address user) private view returns (bool) {
        return participants[user].user != address(0); // Default value for address i.e. 0x0000000000000000000000000000000000000000
    }

    function _addParticipant(address _addr,bool _isAdmin) private {
        participants[_addr] = Participant({
            user: _addr,
            isAdmin: _isAdmin,
            lastPaid: block.timestamp
        });
        participantList.push(_addr);
    }

    // Contribute to the current round
    function contribute() public payable {
        require(isParticipant(msg.sender), "Not a registered participant");
        require(msg.value == contributionAmount, "Invalid contribution amount");
        require(!rounds[currentRound].hasContributed[msg.sender], "Already contributed this round");

        rounds[currentRound].hasContributed[msg.sender] = true;
        rounds[currentRound].totalContributed += msg.value;

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

        // Start next round
        _startNextRound();
    }

    // Internal function to start the next round
    function _startNextRound() private {
        require(currentRound < totalParticipants, "All rounds completed");

        currentRound++;

        // Determine next recipient (simple round-robin for now)
        uint256 nextRecipientIndex = (currentRound - 1) % participantList.length;
        address nextRecipient = participantList[nextRecipientIndex];
        require(nextRecipient != address(0), "Invalid next recipient");

        rounds[currentRound].recipient = nextRecipient;

        emit RoundStarted(currentRound, nextRecipient);
    }

    // View function to check if user can claim the pool
    function canClaimPool(address user) public view returns (bool) {
        return rounds[currentRound].recipient == user &&
               rounds[currentRound].totalContributed == actualTotalAmount &&
               !rounds[currentRound].distributed;
    }

    // View function to check if user has contributed in current round
    function hasContributed(address user) public view returns (bool) {
        return rounds[currentRound].hasContributed[user];
    }
}
