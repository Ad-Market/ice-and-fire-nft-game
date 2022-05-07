import { ethers } from "ethers";
import abi from "./IceFire.json";

const contractAddress = "0x19cBa7bCd79203dc31c116F1f823fe237de8f26b";

export const getContract = async () => {
    try {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const iceFireContract = new ethers.Contract(contractAddress, abi.abi, signer);
            return iceFireContract;
        } else {
            throw new Error("Ethereum object doesn't exist!")
        }
    } catch (error) {
        console.log(error);
    }
};