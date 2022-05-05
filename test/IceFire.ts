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

  describe("mintCharacterNFT()", () => {
    it("Should mint character successfully", async function () {
      const mintTx = await iceFireContract.connect(user2).mintCharacterNFT(1);
      await mintTx.wait();
      const minted = await iceFireContract.nftHolderAttributes(1);
      expect(minted.attributes.name).to.equal("Cersi");
      const newTokenId = await iceFireContract.nftHolders(1);
      expect(newTokenId).to.equal(await user2.getAddress());

      const playerNfts = await iceFireContract.connect(user2).getPlayerNFTs();
      expect(playerNfts[0]).to.equal(1);
    });
  })

  describe("tokenURI()", () => {
    it("Should return token URI string", async function () {
      const mintTx = await iceFireContract.connect(user1).mintCharacterNFT(1);
      await mintTx.wait();
      expect(await iceFireContract.tokenURI(1)).to.equal("data:application/json;base64,eyJuYW1lIjogIkNlcnNpIC0tIE5GVCAjOiAxIiwgImRlc2NyaXB0aW9uIjogIlRoaXMgaXMgYW4gTkZUIHRoYXQgbGV0cyBwZW9wbGUgcGxheSBpbiB0aGUgZ2FtZSBNZXRhdmVyc2UgU2xheWVyISIsICJpbWFnZSI6ICJodHRwczovL2kuaW1ndXIuY29tL3hWdTR2RkwucG5nIiwgImF0dHJpYnV0ZXMiOiBbIHsgInRyYWl0X3R5cGUiOiAiSGVhbHRoIFBvaW50cyIsICJ2YWx1ZSI6IDIwMCwgIm1heF92YWx1ZSI6MjAwfSwgeyAidHJhaXRfdHlwZSI6ICJBdHRhY2sgRGFtYWdlIiwgInZhbHVlIjogNTB9IF19");
    });
  })

  describe("attackPlayer()", () => {
    it("should be owned by attacker", async () => {
      try {
        const mintTx = await iceFireContract.connect(user2).mintCharacterNFT(2);
        await mintTx.wait();
        await iceFireContract.connect(user1).attackPlayer(1, 2);

      } catch (error: any) {
        expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'You are not the owner of NFT'");
      }
    });

    // it("should not attack if health points =< 0", () => {
    // });

    it("should reduce defender health point", async () => {

      const mintTx = await iceFireContract.connect(user2).attackPlayer(1, 2);
      await mintTx.wait();

      const defender = await iceFireContract.nftHolderAttributes(2);
      expect(defender.attributes.healthPoints).to.equal(150);

      const mintTx2 = await iceFireContract.connect(user1).attackPlayer(2, 1);
      await mintTx2.wait();

      const defender2 = await iceFireContract.nftHolderAttributes(1);
      expect(defender2.attributes.healthPoints).to.equal(150);

      const mintTx3 = await iceFireContract.connect(user2).attackPlayer(1, 2);
      await mintTx3.wait();

      const defender3 = await iceFireContract.nftHolderAttributes(2);
      expect(defender3.attributes.healthPoints).to.equal(100);
    })

    it("should not attack if health points =< 0", async () => {
      try {
        const mintTx = await iceFireContract.connect(user2).attackPlayer(1, 2);
        await mintTx.wait();
        const mintTx2 = await iceFireContract.connect(user2).attackPlayer(1, 2);
        await mintTx2.wait();

        const defender = await iceFireContract.nftHolderAttributes(2);
        expect(defender.attributes.healthPoints).to.equal(0);

        const mintTx3 = await iceFireContract.connect(user1).attackPlayer(2, 1);
        await mintTx3.wait();
      } catch (error: any) {
        expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Attacker does not have enough Health Points'");
      }

    });
  })
});
