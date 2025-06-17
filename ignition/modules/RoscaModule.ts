import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

export default buildModule("RoscaModule", (m) => {
  // Define the parameters for the ROSCA contract
  const totalParticipants = 4n;
  const totalAmount = parseEther("4");
  const contributionAmount = totalAmount / totalParticipants;

  // Deploy the ROSCA contract
  const rosca = m.contract("ROSCA", [totalParticipants, totalAmount], {
    value: contributionAmount, // Initial contribution from deployer
  });

  // Return the deployed contract for potential use in other modules
  return { rosca };
});
