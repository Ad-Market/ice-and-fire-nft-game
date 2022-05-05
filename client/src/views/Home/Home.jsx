import React from "react";
import {
  Container,
  CaptionsContainer,
  EmptyContentText
} from "../../components";
import NavBar from "../../components/NavBar";

const Home = props => {
  const { connectWallet, currentAccount } = props;

  return (
    <Container>
      <NavBar
        connectWallet={connectWallet}
        currentAccount={currentAccount}
      />
      <EmptyContentText>Select your fighter..</EmptyContentText>
      <CaptionsContainer>
        <EmptyContentText>No Fighters yet...</EmptyContentText>
      </CaptionsContainer>
    </Container>
  );
};

export default Home;
