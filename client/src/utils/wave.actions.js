
import { getContract } from "./contractUtils";


export const getTotalWaves = async (cb) => {
  try {
    const waveContract = await getContract();
    let count = await waveContract.totalWaves();
    return count.toNumber();
  } catch (error) {
    console.log(error)
  } finally {
    cb && cb()
  }
}

export const getAllWaves = async (cb) => {
  try {
    const waveContract = await getContract();
    const waves = await waveContract.getAllWaves();

    const formattedWaves = waves.map(wave => ({
      address: wave.sender,
      time: (new Date(wave.key * 1000)).toDateString(),
      message: wave.message,
    }))
    cb(formattedWaves)
  } catch (error) {
    console.log(error)
  } finally {
    cb()
  }
}

export const sendWave = async (caption, cb) => {
  try {
    const waveContract = await getContract();
    await waveContract.createWave(caption, { gasLimit: 300000 });
    await cb(1)
  } catch (error) {
    console.log(error);
    cb()
  }
};
