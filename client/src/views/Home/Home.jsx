import React from "react";
import {
  Container,
  CaptionsContainer,
  EmptyContentText,
  WelcomeText
} from "../../components";
import NavBar from "../../components/NavBar";
import Design from "../../assets/img/iaf-bg.png";
import styled from "styled-components";

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
  const { connectWallet, currentAccount } = props;

  return (
    <Container>
      <NavBar
        connectWallet={connectWallet}
        currentAccount={currentAccount}
      />

      {
        currentAccount ? (
          <>
            <EmptyContentText>Select your fighter..</EmptyContentText>
            <CaptionsContainer>
              <EmptyContentText>No Fighters yet...</EmptyContentText>
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
