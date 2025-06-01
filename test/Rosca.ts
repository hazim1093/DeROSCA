import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";

describe("ROSCA", function () {
  async function deployRosca() {
    const [owner, participant1, participant2, participant3] = await hre.viem.getWalletClients();

    const totalParticipants = 4n;
    const totalAmount = parseEther("4"); // 4 ETH
    const contributionAmount = totalAmount / totalParticipants;

    const rosca = await hre.viem.deployContract(
      "ROSCA",
      [totalParticipants, totalAmount],
      { value: contributionAmount }
    );

    return { rosca, owner, participant1, participant2, participant3, totalParticipants, totalAmount, contributionAmount };
  }

  async function registeredRosca() {
    const { rosca, owner, participant1, participant2, participant3, contributionAmount } = await deployRosca();

    await rosca.write.registerParticipant({
      value: contributionAmount,
      account: participant1.account
    });

    await rosca.write.registerParticipant({
      value: contributionAmount,
      account: participant2.account
    });

    await rosca.write.registerParticipant({
      value: contributionAmount,
      account: participant3.account
    });

    return { rosca, owner, participant1, participant2, participant3, contributionAmount };
  }

  async function contributeAll(
    rosca: any,
    owner: { account: { address: string } },
    participant1: { account: { address: string } },
    participant2: { account: { address: string } },
    participant3: { account: { address: string } },
    contributionAmount: bigint
  ) {
    await rosca.write.contribute({
      value: contributionAmount,
      account: owner.account
    });
    await rosca.write.contribute({
      value: contributionAmount,
      account: participant1.account
    });
    await rosca.write.contribute({
      value: contributionAmount,
      account: participant2.account
    });
    await rosca.write.contribute({
      value: contributionAmount,
      account: participant3.account
    });
  }

  describe("Deployment", function() {
    it("Should set the correct initial state", async function () {
      const { rosca, totalParticipants, totalAmount, contributionAmount } = await deployRosca();

      expect(await rosca.read.totalParticipants()).to.equal(totalParticipants);
      expect(await rosca.read.totalAmount()).to.equal(totalAmount);
      expect(await rosca.read.contributionAmount()).to.equal(contributionAmount);
      expect(await rosca.read.currentRound()).to.equal(0n);
    });
  });

  describe("Participant Registration", function() {
    it("Should allow registration with correct contribution", async function() {
      const { rosca, participant1, contributionAmount } = await deployRosca();

      await rosca.write.registerParticipant({
        value: contributionAmount,
        account: participant1.account
      });

      // Check participant was registered
      const participant = await rosca.read.participants([participant1.account.address]);
      expect(participant[0].toLowerCase()).to.equal(participant1.account.address.toLowerCase());
      expect(participant[1]).to.equal(false);
    });

    it("Should reject registration with incorrect contribution", async function() {
      const { rosca, participant1, contributionAmount } = await deployRosca();

      const wrongAmount = contributionAmount - 1n;

      await expect(
        rosca.write.registerParticipant({
          value: wrongAmount,
          account: participant1.account
        })
      ).to.be.rejectedWith("Invalid Contribution Amount");
    });

    it("Should reject duplicate registration", async function() {
      const { rosca, participant1, contributionAmount } = await deployRosca();

      // First registration
      await rosca.write.registerParticipant({
        value: contributionAmount,
        account: participant1.account
      });

      // Try to register again
      await expect(
        rosca.write.registerParticipant({
          value: contributionAmount,
          account: participant1.account
        })
      ).to.be.rejectedWith("User Already Registered");
    });
  });

  describe("Contribution", function() {
    it("Should track registration payment as contribution", async function() {
      const { rosca, participant1, contributionAmount } = await deployRosca();

      // Register participant with contribution amount
      await rosca.write.registerParticipant({
        value: contributionAmount,
        account: participant1.account
      });

      // Check if registration payment was tracked as contribution
      expect(await rosca.read.hasContributed([participant1.account.address])).to.equal(true,
        "Registration payment should be tracked as contribution");

      // Check round's total contributed (in round 0, not 1)
      const round = await rosca.read.rounds([0n]);
      expect(round[2]).to.equal(contributionAmount * 2n,
        "Registration payment should be added to round's total contribution"); // 2n because round 0 has 2 participants
    });

    it("Should not allow contribution by same participant in the same round as registration", async function() {
      const { rosca, participant1, contributionAmount } = await deployRosca();

      // Register participant
      await rosca.write.registerParticipant({
        value: contributionAmount,
        account: participant1.account
      })


      await expect(
        rosca.write.contribute({
          value: contributionAmount,
          account: participant1.account
        })
      ).to.be.rejectedWith("Already contributed this round");
    });

    it("Should allow contribution after round advances", async function() {
      const { rosca, owner, participant1, contributionAmount } = await registeredRosca();
      // Distribute round 0's pool to advance to round 1
      await rosca.write.distributePool({
        account: owner.account
      });

      // Now we can contribute to round 1
      await rosca.write.contribute({
        value: contributionAmount,
        account: participant1.account
      });
    });
  });

  describe("Round Management", function() {

    it("Should set recipients and distribute pool in order of registration", async function() {
      const { rosca, owner, participant1, participant2, participant3, contributionAmount } = await registeredRosca();

      // After all registered, verify recipient order matches registration order
      // Round 0: owner (deployer was first)
      const round0 = await rosca.read.rounds([0n]);
      expect(round0[0].toLowerCase()).to.equal(owner.account.address.toLowerCase());

      //distribute pool
      await rosca.write.distributePool({
        account: owner.account
      });

      // Round 1: participant1 (registered second)
      const round1 = await rosca.read.rounds([1n]);
      expect(round1[0].toLowerCase()).to.equal(participant1.account.address.toLowerCase());

      await contributeAll(rosca, owner, participant1, participant2, participant3, contributionAmount);

      //distribute pool
      await rosca.write.distributePool({
        account: participant1.account
      });

      // Round 2: participant2 (registered third)
      const round2 = await rosca.read.rounds([2n]);
      expect(round2[0].toLowerCase()).to.equal(participant2.account.address.toLowerCase());

      await contributeAll(rosca, owner, participant1, participant2, participant3, contributionAmount);

      //distribute pool
      await rosca.write.distributePool({
        account: participant2.account
      });
      // Round 3: participant3 (registered last)
      const round3 = await rosca.read.rounds([3n]);
      expect(round3[0].toLowerCase()).to.equal(participant3.account.address.toLowerCase());

      await contributeAll(rosca, owner, participant1, participant2, participant3, contributionAmount);

      //distribute pool
      await rosca.write.distributePool({
        account: participant3.account
      });

    });
  });

  describe("Pool Distribution", function() {
    it("Should fail distribution if all participants have not contributed", async function() {
      const { rosca, owner, participant1, contributionAmount } = await deployRosca();

      // Register participant
      await rosca.write.registerParticipant({
        value: contributionAmount,
        account: participant1.account
      });

      await expect(
        rosca.write.distributePool({
          account: owner.account
        })
      ).to.be.rejectedWith("Cannot claim pool");
    });

    it("Should fail distribution if not the recipient", async function() {
      const { rosca, owner, participant1, contributionAmount } = await deployRosca();

      await expect(
        rosca.write.distributePool({
          account: participant1.account
        })
      ).to.be.rejectedWith("Not a registered participant");
    });

    it("Should fail distribution if not the round recipient", async function() {
      const { rosca, owner, participant1, contributionAmount } = await registeredRosca();

      await expect(
        rosca.write.distributePool({
          account: participant1.account
        })
      ).to.be.rejectedWith("Cannot claim pool");
    });

    it("Should allow distribution if all participants have contributed", async function() {
      const { rosca, owner, participant1, participant2, participant3, contributionAmount } = await registeredRosca();

      // Check current round before distribution
      expect(await rosca.read.currentRound()).to.equal(0n);

      await rosca.write.distributePool({
        account: owner.account
      });

      // Verify round advanced
      expect(await rosca.read.currentRound()).to.equal(1n);

      // Verify next round recipient
      const round1 = await rosca.read.rounds([1n]);
      expect(round1[0].toLowerCase()).to.equal(participant1.account.address.toLowerCase());
    });
  });
});
