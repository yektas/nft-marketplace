import { ethers } from "hardhat";

async function main() {
  const Market = await ethers.getContractFactory("Marketplace");
  const market = await Market.deploy();

  await market.deployed();

  const HeraCollection = await ethers.getContractFactory("HeraCollection");
  const heraCollection = await HeraCollection.deploy(market.address);

  await heraCollection.deployed();

  console.log("Hera collection deployed to:", heraCollection.address);
  console.log("Marketplace deployed to:", market.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
