import { ethers } from "hardhat";
import { Contract } from "ethers";

const main = async () => {
  const iceFireContractFactory = await ethers.getContractFactory("IceFire");
  const iceFireContract = await iceFireContractFactory.deploy(
    ["Ice King", "John Snow", "Jaime", "Arya", "Tormund Giantsbane", "Khal Drogo"],
    ["https://res.cloudinary.com/dgy1kku4c/image/upload/v1651921685/blockchain/ice-king_vlfn8o.webp",
      "https://res.cloudinary.com/dgy1kku4c/image/upload/v1651921694/blockchain/john-snow_db2zqo.webp",
      "https://res.cloudinary.com/dgy1kku4c/image/upload/v1651921696/blockchain/jamie-lannister_fn6mmp.webp",
      "https://res.cloudinary.com/dgy1kku4c/image/upload/v1651921684/blockchain/arya-stark_lwwdrs.webp",
      "https://res.cloudinary.com/dgy1kku4c/image/upload/v1651922001/blockchain/tormund_gelh3x.webp",
      "https://res.cloudinary.com/dgy1kku4c/image/upload/v1651922002/blockchain/khal_drogo_bh20pb.webp"],
    [350, 300, 290, 250, 300, 320],
    [25, 30, 25, 40, 30, 34],
    ["North", "Stark", "Lannister", "Stark", "Wildlings", "Deserts"],
    [1000, 27, 32, 17, 36, 42]);

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