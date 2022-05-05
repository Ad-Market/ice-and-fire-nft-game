import React from "react";
import { string } from "prop-types";
import styled from "styled-components";
import { PRI_COLOR } from "../utils/constants";

const Container = styled.div`
  text-align: center;
  padding: ${props => (props.size ? 0 : "100px")};
`;

const Spinner = styled.div`
  &.lds-hourglass {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
  }

  &.lds-hourglass-small {
    display: inline-block;
    position: relative;
    width: 24px;
    height: 24px;
  }

  &:after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 6px;
    box-sizing: border-box;
    border: ${props => props.small ? '0.8rem' : '1.5rem'} solid ${props => props.color ? props.color : PRI_COLOR};
    border-color: ${props => props.color ? props.color : PRI_COLOR} transparent ${props => props.color ? props.color : PRI_COLOR} transparent;
    animation: lds-hourglass 1.2s infinite;
  }


@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}

@keyframes lds-hourglass-small {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}
`;

const Loader = ({ size, color = PRI_COLOR }) => (
  <Container size={size}>
    {size ? (
      <Spinner data-testid="loader" className={`lds-hourglass-${size}`} small color={color} />
    ) : (
      <Spinner data-testid="loader" className="lds-hourglass" color={color}/>
    )}
  </Container>
);

Loader.defaultProps = {
  size: "",
  color: ""
};

Loader.propTypes = {
  size: string,
  color: string
};

export default Loader;
