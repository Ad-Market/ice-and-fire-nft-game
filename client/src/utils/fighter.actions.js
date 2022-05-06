
import { getContract } from "./contractUtils";


export const getTotalPlayers = async (cb) => {
  try {
    const iceFireContract = await getContract();
    let playerIds = await iceFireContract.getPlayerNFTs();
    return playerIds.length;
  } catch (error) {
    console.log(error)
  } finally {
    cb && cb()
  }
}

export const getAllFighters = async (cb) => {
  try {
    const iceFireContract = await getContract();
    const playerTokenIds = await iceFireContract.getPlayerNFTs();
    Promise.allSettled(playerTokenIds.map(async player => {
      return await iceFireContract.getUserNFTAttributes(player);
    })).then(players => {
      cb(players.map(res => ({
        name: res.value.attributes.name,
        image: res.value.attributes.imageURI,
        characterIndex: res.value.attributes.characterIndex.toNumber(),
        house: res.value.attributes.house,
        age: res.value.attributes.age,
        attackDamage: res.value.attributes.attackDamage.toNumber(),
        healthPoints: res.value.attributes.healthPoints.toNumber(),
        tokenId: res.value.tokenId.toNumber(),
        createdAt: (new Date(res.value.createdAt * 1000)).toDateString(),
      })))
    })
  } catch (error) {
    console.log(error)
  } finally {
    cb()
  }
}

export const getDefaultFighters = async (cb) => {
  try {
    const iceFireContract = await getContract();
    const players = await iceFireContract.getAllDefaultCharacters();
    const formattedFighters = players.map(player => ({
      name: player.name,
      image: player.imageURI,
      characterIndex: player.characterIndex.toNumber(),
      house: player.house,
      age: player.age,
      attackDamage: player.attackDamage.toNumber(),
      healthPoints: player.healthPoints.toNumber(),
    }))
    await cb(formattedFighters)
  } catch (error) {
    console.log(error)
  } finally {
    cb()
  }
}

export const attackPlayer = async (attacker, defender, cb) => {
  try {
    // const waveContract = await getContract();
    // await waveContract.createWave(caption, { gasLimit: 300000 });
    // await cb(1)
  } catch (error) {
    console.log(error);
    cb()
  }
};
