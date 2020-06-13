import React, { Fragment } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

// import { ReactComponent as Sumo } from 'Assets/svg/sumo.svg';
import ProjectHtml from "./ProjectHtml";
import TypingMessage from "./TypingMessage";
import { Title } from "../themes/styled";

const fadeUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: none; opacity: 1; }
`;

const StyledLink = styled(Link)`
  position: relative;
  padding: 0;
  display: block;
  ${(p) => p.theme.active}
  text-align: center;
`;

const Wrap = styled.div`
  position: relative;
`;

const Appear = styled.div`
  animation: ${fadeUp} 1s 1 linear;
  transform-origin: center;
`;

const Infos = styled.div`
  position: absolute;
  width: 45%;
  left: 50%;
  top: 0;
  max-width: 200px;
  margin: 0 auto;
  transform: translate3d(50%, 0, 0);
  background: ${(p) => p.theme.text};
  padding: 1em;
  pointer-events: none;

  @media (max-width: 570px) {
    transform: none;
    width: 100%;
    left: 0;
    top: 50%;
    max-width: none;
    opacity: 0.9;
  }
`;

const StyledHtml = styled(ProjectHtml)`
  text-align: center;
  margin: 0 auto;
  width: 100%;
  height: 60vh;
  max-height: 512px;
`;

// const StyledSumo = styled(Sumo)`
//   width: 200px;
//   height: auto;
//   stroke: none;
//   margin: 0 auto;

//   .body {
//     fill: none; /* ${(p) => p.theme.text}; */
//   }
//   .face,
//   .hair,
//   .shadow {
//     fill: ${(p) => p.theme.light};
//   }
//   .belt {
//     fill: url(#linearGradient5006);
//   }
// `;

const Balloon = styled.svg`
  position: absolute;
  fill: ${(p) => p.theme.text};
  @media (max-width: 570px) {
    display: none;
  }
`;

const LeftBalloon = styled(Balloon)`
  top: 0;
  right: 100%;
  width: auto;
  height: 100%;
`;

const RightBalloon = styled(Balloon)`
  top: 0;
  left: 100%;
  width: auto;
  height: 100%;
`;

const BottomBalloon = styled(Balloon)`
  top: 100%;
  left: 0;
  height: auto;
  width: 100%;
`;

const TopBalloon = styled(Balloon)`
  bottom: 100%;
  left: 0;
  height: auto;
  width: 100%;
`;

const SpikeBalloon = styled(Balloon)`
  top: 100%;
  left: 10%;
  height: 1em;
  width: 1em;

  @media (max-width: 570px) {
    transform: rotateY(-180deg);
  }
`;

const StyledTitle = styled(Title)`
  font-size: 1.6em;
  margin: 0 0 0.4em;
`;

const Description = styled.p`
  color: ${(p) => p.theme.backgroundHighlight};
  width: 100%;
  line-height: 1.4;

  a {
    text-transform: lowercase;
    pointer-events: auto;
    opacity: 0.8;
    transition: opacity 300ms ease-out;
  }
  a:hover {
    opacity: 1;
  }
`;

const Signature = ({ className, hello }) => (
  <Wrap>
    <Appear>
      <StyledLink to="/about" className={className}>
        {/* <StyledSumo /> */}
        <StyledHtml slug="signature" colorType={0} />
      </StyledLink>
      <Infos>
        <LeftBalloon viewBox="0 0 100 100">
          <path d="M 100 0 L 90 10 L 100 100 Z" />
        </LeftBalloon>
        <RightBalloon viewBox="0 0 100 100">
          <path d="M 0 0 L 10 10 L 0 100 Z" />
        </RightBalloon>
        <BottomBalloon viewBox="0 0 100 100">
          <path d="M 0 0 L 90 10 L 100 0 Z" />
        </BottomBalloon>
        <TopBalloon viewBox="0 0 100 100">
          <path d="M 0 100 L 90 90 L 100 100 Z" />
        </TopBalloon>
        <TopBalloon viewBox="0 0 100 100">
          <path d="M 0 100 L 90 90 L 100 100 Z" />
        </TopBalloon>
        <SpikeBalloon viewBox="0 0 100 100">
          <path d="M 20 0 L 0 100 L 100 0 Z" />
        </SpikeBalloon>
        <StyledTitle>
          {hello.title.split(' ').map(text => (
            <Fragment key={text}>
              <TypingMessage message={text} />
              {' '}
            </Fragment>
        ))}
        </StyledTitle>
        <Description>
          {hello.text}
          {/* <br />
          <a href={`mailto:${process.env.MAIL}`}>{hello.contact}</a> */}
        </Description>
      </Infos>
    </Appear>
  </Wrap>
);

export default Signature;
