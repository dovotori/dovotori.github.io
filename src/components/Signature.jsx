import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

import ProjectLabo from './ProjectLabo';
import TypingMessage from './TypingMessage';

const fadeUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: none; opacity: 1; }
`;

const StyledTypingMessage = styled(TypingMessage)`
  span {
    justify-content: left;
  }
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
  /* position: absolute; */
  width: 45%;
  transform: translate3d(80%, 0, 0);
  left: 50%;
  top: 0;
  max-width: 200px;
  margin: 0 auto;
  background: ${(p) => p.theme.text};
  padding: 1em;
  pointer-events: none;

  ${(p) => p.theme.media.mobile`
    transform: none;
    width: 100%;
    left: auto;
    top: auto;
    max-width: none;
    text-align:center;
    position: relative;

  `}
`;

const StyledLabo = styled(ProjectLabo)`
  text-align: center;
  margin: 0 auto;
  /* width: 100%; */
  width: 320px;
  height: 320px;

  /* ${(p) => p.theme.media.desktop`
    height: 60vh;
  `} */

  /* only for picto */
  canvas {
    /* width: auto; */
  }
`;

const Balloon = styled.svg`
  position: absolute;
  fill: ${(p) => p.theme.text};
  ${(p) => p.theme.media.mobile`display: none;`}
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

  ${(p) => p.theme.media.mobile`transform: rotateY(-180deg);`}
`;

const Description = styled.p`
  color: ${(p) => p.theme.backgroundHighlight};
  width: 100%;
  user-select: none;

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

const commonName = css`
  /* position: absolute; */
  /* left: 50%;
  transform: translate3d(-50%, -50%, 0); */
  width: 100%;
  text-align: left;
  pointer-events: none;
  user-select: none;

  ${(p) => p.theme.media.mobile`text-align: center;`};
`;

const Name = styled.h2`
  /* ${(p) => p.theme.title} */
  ${commonName}
  /* top: 60%; */
  letter-spacing: 0.1em;
  line-height: 1;
  margin: 0;
  /* margin-bottom: 1em; */
  color: ${(p) => p.theme.primary};
`;

const Katakana = styled.h1`
  /* ${(p) => p.theme.title} */
  /* top: 70%; */
  ${commonName}
  margin-top: -0.2em;
  color: ${(p) => p.theme.text};
  ${(p) => p.theme.media.mobile`
    font-size: 200%;
  `}
`;

const CenterMobile = styled.div`
  ${(p) => p.theme.media.mobile`
`}
`;

const Absolute = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(40%, 0, 0);

  ${(p) => p.theme.media.mobile`
    transform: none;
    width: 100%;
    left: auto;
    top: auto;
    max-width: none;
    text-align:center;
    position: relative;
  `}
`;

const Signature = ({ className, hello }) => (
  <Wrap>
    <Appear>
      {/* <CenterMobile>
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
          
          <Description>{hello.text}</Description>
        </Infos>
      </CenterMobile> */}

      <StyledLink to="/about" className={className} title="about">
        <StyledLabo slug="picto" $colorType={0} noBackground hasJs />
      </StyledLink>
    </Appear>

    <Absolute>
      <Name>
        <StyledTypingMessage
          message="dorian"
          firstMessage="ドリアン"
          width="0.9em"
          isLoop
          delay={5000}
        />
      </Name>

      <Katakana>
        <StyledTypingMessage message="ドリアン" width="2em" isLoop delay={5000} />
      </Katakana>
    </Absolute>
  </Wrap>
);

export default Signature;
