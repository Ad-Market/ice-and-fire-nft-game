import React from "react";
import styled from "styled-components";
import { breakpoints, PRI_COLOR, PRI_COLOR_FADED, } from "../utils/constants";
import { EmptyContentText } from ".";

const Navbar = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 0.3rem;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const LogoContainer = styled.div`
`;

const MenuContainer = styled.div`
  height: 100%;
  padding-right: 3rem;

  @media screen and ${breakpoints.sm} {
    width: 25%;
    padding-right: 1rem;
  }
`;

export const BTN = styled.button`
  align-items: center;
  align-self: center;
  border-radius: 10px 10px 0 0;
  color: #000;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 300;
  height: 100%;
  margin: 2px 6px 2px 12px;
  outline: 0;
  padding: 0 0.7em;
  user-select: none;
  text-decoration: none;
  background-color: ${PRI_COLOR};
  color: #fff;

  &:hover {
    box-shadow: 0 0 0.8rem 0.1rem ${PRI_COLOR_FADED};
  }

  @media screen and (min-width: 756px) {
    display: inline-flex;
  }
`

const NavBar = ({ connectWallet, totalPlayers, currentAccount, playersCount }) => {

  return (
    <Navbar>
      <LogoContainer>
        <EmptyContentText style={{ fontSize: '1rem' }}>Ice & Fire</EmptyContentText>
      </LogoContainer>
      <MenuContainer>
        {
          !currentAccount ? (
            <BTN onClick={connectWallet}>
              Connect to Wallet on Rinkeby testnet
            </BTN>
          ) : <BTN onClick={() => playersCount()} >
            Number of Fighters: {totalPlayers}
          </BTN>
        }
      </MenuContainer>
    </Navbar>
  );
};

export default NavBar;
