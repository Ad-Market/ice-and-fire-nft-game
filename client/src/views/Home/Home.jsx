import React, { useState } from "react";
import {
  Container,
  CaptionsContainer,
  EmptyContentText,
  WelcomeText,
  CaptionCard,
  CaptionCardHeader,
  CaptionText
} from "../../components";
import NavBar from "../../components/NavBar";
import Design from "../../assets/img/iaf-bg.png";
import styled from "styled-components";
import { PRI_COLOR_FADED } from "../../utils/constants";

const SectionContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background-image: url(${Design});
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
`;

const Home = props => {
  const {
    connectWallet,
    currentAccount,
    defaultFighters,
    playersCount,
    totalPlayers,
    myFighters,
    player1,
    setPlayer1,
    player2,
    setPlayer2
  } = props;

  const [playerNumber, setPlayerNumber] = useState(1);

  return (
    <Container>
      <NavBar
        connectWallet={connectWallet}
        currentAccount={currentAccount}
        playersCount={playersCount}
        totalPlayers={totalPlayers}
      />

      {
        currentAccount ? (
          <>
            {
              totalPlayers > 0 ? (
                <>
                  <EmptyContentText>My Fighters</EmptyContentText>
                  <CaptionsContainer >
                    {
                      myFighters.map(fighter => (
                        <>
                          <CaptionCard
                            key={fighter.tokenId}
                            style={{
                              animation: "normal",
                              backgroundColor: [player1, player2].includes(fighter.tokenId) ? '#333' : '#111',
                              ...([player1, player2].includes(fighter.tokenId) ? {
                                boxShadow: `0 0 0.5rem 0.4rem ${PRI_COLOR_FADED}`
                              } : {})
                            }}
                            onClick={() => {
                              if (playerNumber === 1) {
                                setPlayer1(fighter.tokenId);
                                setPlayerNumber(2);
                              } else if (playerNumber === 2) {
                                setPlayer2(fighter.tokenId);
                                setPlayerNumber(1);
                              }
                            }}
                          >
                            <img src={fighter.image} alt={`${fighter.name} face`} width="100%" height="100%" />
                            <CaptionCardHeader >
                              {`${fighter.name} of House ${fighter.house}`}
                            </CaptionCardHeader>
                            <CaptionText className="stat" >Health: {fighter.healthPoints}</CaptionText>
                            <CaptionText className="stat" >Attack: {fighter.attackDamage}</CaptionText>
                            <CaptionText className="stat smaller" >
                              Created at: {fighter.createdAt}
                            </CaptionText>
                          </CaptionCard>
                        </>
                      ))
                    }
                  </CaptionsContainer>
                </>
              ) : null
            }
            <EmptyContentText>Create new fighter..</EmptyContentText>
            <CaptionsContainer>
              {
                defaultFighters.map(fighter => (<CaptionCard >
                  <img src={fighter.image} alt={`${fighter.name} face`} width="100%" height="100%" />
                  <CaptionCardHeader >{`${fighter.name} of House ${fighter.house}`}</CaptionCardHeader>
                  <CaptionText >
                    {`${fighter.name} is ${fighter.age} years old with Strength ratings of ${fighter.healthPoints} and Attack impact of ${fighter.attackDamage}`}
                  </CaptionText>
                </CaptionCard>))
              }
            </CaptionsContainer>
          </>

        ) : (
          <SectionContainer>
            <WelcomeText >
              Ice and Fire
            </WelcomeText>
          </SectionContainer>
        )
      }



    </Container>
  );
};

export default Home;
