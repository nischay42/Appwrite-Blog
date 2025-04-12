import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% { transform: rotate(0deg) scale(0.8) }
  50% { transform: rotate(360deg) scale(1.2) }
  100% { transform: rotate(720deg) scale(0.8) }
`;

const ball1 = keyframes`
  0% {
    box-shadow: 30px 0 0 #ff3d00;
  }
  50% {
    box-shadow: 0 0 0 #ff3d00;
    margin-bottom: 0;
    transform: translate(15px, 15px);
  }
  100% {
    box-shadow: 30px 0 0 #ff3d00;
    margin-bottom: 10px;
  }
`;

const ball2 = keyframes`
  0% {
    box-shadow: 30px 0 0 #fff;
  }
  50% {
    box-shadow: 0 0 0 #fff;
    margin-top: -20px;
    transform: translate(15px, 15px);
  }
  100% {
    box-shadow: 30px 0 0 #fff;
    margin-top: 0;
  }
`;

const LoaderWrapper = styled.span`
  animation: ${rotate} 1s infinite;
  height: 50px;
  width: 50px;
  display: inline-block;
  position: relative;

  &::before,
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    position: absolute;
  }

  &::before {
    animation: ${ball1} 1s infinite;
    background-color: #fff;
    box-shadow: 30px 0 0 #ff3d00;
    bottom: 25px;
  }

  &::after {
    animation: ${ball2} 1s infinite;
    background-color: #ff3d00;
    box-shadow: 30px 0 0 #fff;
    top: 25px;
  }
`;

const Loader = () => {
  return <div className=" h-screen flex justify-center items-center"><LoaderWrapper /></div>;
};

export default Loader;
