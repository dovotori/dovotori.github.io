import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

// import { ReactComponent as Sumo } from 'Assets/svg/sumo.svg';
import ProjectHtml from './ProjectHtml';
import TypingMessage from './TypingMessage';
import { Title } from '../themes/styled';

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
  top: 10%;
  max-width: 200px;
  margin: 0 auto;
  transform: translate3d(50%, 0, 0);
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

const StyledHtml = styled(ProjectHtml)`
  text-align: center;
  margin: 0 auto;
  width: 100%;
  height: 60vh;
  max-height: 512px;
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
  line-height: 1.4;
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
  position: absolute;
  top: 50%;
  font-size: 400%;
  transform: translate3d(0, -50%, 0);
  letter-spacing: 0;
  pointer-events: none;
  user-select: none;
  ${(p) => p.theme.media.mobile`
    text-align: center;
    width: 100%;
    position: relative;
    top: auto;
  `}
`;

const Name = styled(Title)`
  ${commonName}
  color:${(p) => p.theme.text};
  right: 54%;
  text-align: right;
  font-size: 300%;
  ${(p) => p.theme.media.mobile`
    right: auto;
  `}
`;

const Katakana = styled(Title)`
  ${commonName}
  left: 54%;
  text-align: left;
  font-family: 'nikkyou', monospace;
  ${(p) => p.theme.media.mobile`
    left: auto;
  `}
`;

const CenterMobile = styled.div`
  ${(p) => p.theme.media.mobile`
  position: absolute;
  top: 60%;
  left: 0;
  width: 100%;`}
`;

const Signature = ({ className, hello }) => (
  <Wrap>
    <Appear>
      <StyledLink to="/about" className={className}>
        <StyledHtml slug="signature" colorType={0} />
      </StyledLink>
      <CenterMobile>
        <Katakana>
          <TypingMessage message="ド リ ア ン" />
        </Katakana>
        <Name>
          <TypingMessage message="D o r i a n" />
        </Name>
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
      </CenterMobile>
    </Appear>
  </Wrap>
);

export default Signature;
