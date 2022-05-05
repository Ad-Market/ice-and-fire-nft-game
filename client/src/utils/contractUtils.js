import { ethers } from "ethers";
import abi from "./WavePortal.json";

const contractAddress = "0x2D7aF0C51ED7aBa1186dB2a1921c4abA6DAB0cF0";

export const getContract = async () => {
    try {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalContract = new ethers.Contract(contractAddress, abi.abi, signer);

            return wavePortalContract;
        } else {
            throw new Error("Ethereum object doesn't exist!")
        }
    } catch (error) {
        console.log(error);
    }
};