import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Balloon from 'Assets/svg/balloon2.svg';
import Canvas from './Canvas';
import TypingMessage from './TypingMessage';
import { Title } from '../themes/styled';

const StyledLink = styled(Link)`
  position: relative;
  padding: 0;
  display: block;
  ${(p) => p.theme.active}
`;

const Infos = styled.div`
  position: relative;
  width: 45%;
  max-width: 200px;
  margin: 0 auto;
  transform: translate3d(105%, -25%, 0);
  @media (max-width: 570px) {
    transform: none;
    width: 100%;
  }
`;

const StyledCanvas = styled(Canvas)`
  text-align: center;
  
  @media (min-width: 570px) {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate3d(-50%,0,0);
  }

  canvas {
    margin: 0 auto;
    width: 20vh;
    height: 20vh;
    max-width: 512px;
    max-height: 512px;
  }
`;

const StyledBalloon = styled(Balloon)`
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  transform: translate3d(-100%, 10%, 0);
`;

const StyledTitle = styled(Title)`
  position: relative;
`;

const Description = styled.p`
  color: ${(p) => p.theme.text};
  width: 100%;
  line-height: 1.4;
  font-style: italic;

  a {
    opacity: 0.8;
    transition: opacity 300ms ease-out;
  }
  a:hover {
    opacity: 1;
  }
`;

const StyledTypingMessage = styled(TypingMessage)`
  pointer-events: none;
  position: relative;
  white-space: no-wrap;
  overflow:hidden;
`;

const Signature = ({ className, hello }) => (
  <StyledLink to="/about" className={className}>
    <Infos>
      <StyledBalloon />
      <StyledTitle>
        <StyledTypingMessage message={hello.title} />
      </StyledTitle>
      <Description>
        {hello.text}
        <br />
        <a href={`mailto:${process.env.MAIL}`}>{hello.contact}</a>
      </Description>
    </Infos>
    <StyledCanvas slug="webgl" width={512} height={512} colorType={0} />
  </StyledLink>
);

export default Signature;
