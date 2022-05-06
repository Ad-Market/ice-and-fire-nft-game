import { ethers } from "hardhat";
import { Contract } from "ethers";

const main = async () => {
  const iceFireContractFactory = await ethers.getContractFactory("IceFire");
  const iceFireContract = await iceFireContractFactory.deploy(
    ["Arya", "Cersi", "Ellia"],
    ["https://i.imgur.com/pKd5Sdk.png",
      "https://i.imgur.com/xVu4vFL.png",
      "https://i.imgur.com/WMB6g9u.png"],
    [100, 200, 300],
    [100, 50, 25],
    ["Stark", "Lannister", "Sand"],
    [13, 32, 36]);

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