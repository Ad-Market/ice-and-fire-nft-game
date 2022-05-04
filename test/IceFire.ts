import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";

describe("IceFire", function () {
  let iceFireContract: Contract;
  let owner: Signer, user1: Signer, user2: Signer;
  before(async () => {
    const iceFireContractFactory = await ethers.getContractFactory("IceFire");
    iceFireContract = await iceFireContractFactory.deploy(
      ["Arya", "Cersi", "Ellia"],
      ["https://i.imgur.com/pKd5Sdk.png",
        "https://i.imgur.com/xVu4vFL.png",
        "https://i.imgur.com/WMB6g9u.png"],
      [100, 200, 300],
      [100, 50, 25],
      ["Stark", "Lannister", "Sand"],
      [13, 32, 36]);
    await iceFireContract.deployed();
    [owner, user1, user2] = await ethers.getSigners();
  })

  it("Should save default fighter attributes", async function () {
    const defaultCharacter = await iceFireContract.defaultCharacters(1);
    expect(defaultCharacter.name).to.equal("Cersi");
  });

  it("Should mint character successfully", async function () {
    const mintTx = await iceFireContract.connect(user2).mintCharacterNFT(1);
    await mintTx.wait();
    const minted = await iceFireContract.nftHolderAttributes(1);
    expect(minted.name).to.equal("Cersi");
    const newItemId = await iceFireContract.nftHolders(user2.getAddress());
    expect(newItemId).to.equal(1);
  });

  it("Should mint character successfully", async function () {
    const mintTx = await iceFireContract.connect(user1).mintCharacterNFT(1);
    await mintTx.wait();
    expect(await iceFireContract.tokenURI(1)).to.equal("data:application/json;base64,eyJuYW1lIjogIkNlcnNpIC0tIE5GVCAjOiAxIiwgImRlc2NyaXB0aW9uIjogIlRoaXMgaXMgYW4gTkZUIHRoYXQgbGV0cyBwZW9wbGUgcGxheSBpbiB0aGUgZ2FtZSBNZXRhdmVyc2UgU2xheWVyISIsICJpbWFnZSI6ICJodHRwczovL2kuaW1ndXIuY29tL3hWdTR2RkwucG5nIiwgImF0dHJpYnV0ZXMiOiBbIHsgInRyYWl0X3R5cGUiOiAiSGVhbHRoIFBvaW50cyIsICJ2YWx1ZSI6IDIwMCwgIm1heF92YWx1ZSI6MjAwfSwgeyAidHJhaXRfdHlwZSI6ICJBdHRhY2sgRGFtYWdlIiwgInZhbHVlIjogNTB9IF19");
  });
});
