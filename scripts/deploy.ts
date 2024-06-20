const hre = require("hardhat");

async function main() {
 

  const SBT = await hre.ethers.deployContract("SoulBoundToken");

  await SBT.waitForDeployment();

  console.log(`SBT contract deployed to ${SBT.target}`);

   const Agreement = await hre.ethers.deployContract("AgreementContract", [SBT.target]);

  await Agreement.waitForDeployment();

  console.log(`Agreement contract deployed to ${Agreement.target}`);

  
}

//DEFAULT BY HARDHAT:
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
