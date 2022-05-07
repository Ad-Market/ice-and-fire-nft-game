import { ethers } from "hardhat";
import { Contract } from "ethers";

const main = async () => {
  const iceFireContractFactory = await ethers.getContractFactory("IceFire");
  const iceFireContract = await iceFireContractFactory.deploy(
    ["Ice King", "John Snow", "Jaime", "Arya"],
    ["https://cutt.ly/6GNdg65",
      "https://cutt.ly/OGNdbKY",
      "https://cutt.ly/pGNdRPA",
      "https://cutt.ly/UGNdIW4"],
    [350, 300, 290, 250],
    [25, 30, 25, 40],
    ["North", "Stark", "Lannister", "Stark"],
    [1000, 27, 32, 17]);

  await iceFireContract.deployed();
  console.log("Contract deployed to:", iceFireContract.address);

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();