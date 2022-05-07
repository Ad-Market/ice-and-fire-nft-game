import React, { useEffect, useState, useCallback } from "react";
import Home from "./Home";
import {
  getAllFighters,
  getDefaultFighters,
  getTotalPlayers
} from "../../utils/fighter.actions";
import { getContract } from "../../utils/contractUtils";

const HomeContainer = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [defaultFighters, setDefaultFighters] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState("0");
  const [myFighters, setMyFighters] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null)

  const playerMintListenerCallback = useCallback(
    async () => {
      const onCharacterNFTMinted = async (from, tokenId, fighterIndex) => {
        console.log(from, tokenId, fighterIndex);
        const mintedPlayer = await iceFireContract.getUserNFTAttributes(tokenId);
        setMyFighters(prev => [...prev, {
          name: mintedPlayer.attributes.name,
          image: mintedPlayer.attributes.imageURI,
          characterIndex: mintedPlayer.attributes.characterIndex.toNumber(),
          house: mintedPlayer.attributes.house,
          age: mintedPlayer.attributes.age,
          attackDamage: mintedPlayer.attributes.attackDamage.toNumber(),
          healthPoints: mintedPlayer.attributes.healthPoints.toNumber(),
          tokenId: mintedPlayer.tokenId.toNumber(),
          createdAt: (new Date(mintedPlayer.createdAt * 1000)).toDateString(),
        }])
      }
      const iceFireContract = await getContract();
      iceFireContract.on("CharacterNFTMinted", onCharacterNFTMinted);

      return () => {
        iceFireContract.off("CharacterNFTMinted", onCharacterNFTMinted);
      }
    },
    // eslint-disable-next-line
    [],
  )


  useEffect(() => {
    playerMintListenerCallback()
    // eslint-disable-next-line
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!window.ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object");
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        console.log("Found an authorized account:", accounts[0]);
        setCurrentAccount(accounts[0])
      } else {
        console.log("No authorized account found")
        connectWallet()
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install metamask");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected to: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const playersCount = async () => {
    try {
      const players = await getTotalPlayers();
      setTotalPlayers(players);
    } catch (error) {
      console.log(error)
    }
  }

  const listenerCallback = useCallback(
    async () => {
      const onCharacterNFTMinted = () => {
        setTotalPlayers(prev => parseInt(prev) + 1);
      }
      const iceFireContract = await getContract();
      iceFireContract.on("CharacterNFTMinted", onCharacterNFTMinted);

      return () => {
        iceFireContract.off("CharacterNFTMinted", onCharacterNFTMinted);
      }
    },
    // eslint-disable-next-line
    [],
  )

  const getMyFighters = async () => {
    try {
      await getAllFighters((fighters => {
        if (fighters) {
          setMyFighters(fighters);
        }
      }));

    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected()
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentAccount) {
      getMyFighters();
      getDefaultFighters((fighters) => {
        if (fighters) {
          setDefaultFighters(fighters)
        }
      })
    }
    // eslint-disable-next-line
  }, [currentAccount]);

  useEffect(() => {
    playersCount()
  }, [currentAccount]);

  useEffect(() => {
    listenerCallback()
    // eslint-disable-next-line
  }, []);

  return (
    <Home
      connectWallet={connectWallet}
      currentAccount={currentAccount}
      defaultFighters={defaultFighters}
      player1={player1}
      player2={player2}
      playersCount={playersCount}
      totalPlayers={totalPlayers}
      myFighters={myFighters}
      setPlayer1={setPlayer1}
      setPlayer2={setPlayer2}
    />
  );
};


export default HomeContainer;
