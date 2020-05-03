import React from "react";
import styled, { keyframes } from "styled-components";

const glitchHorizontal = keyframes`
  0% { 
    -webkit-clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
  }
  50% { 
    -webkit-clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
  }
  55% {
    -webkit-clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
    clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
  }
  60% {
    -webkit-clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
    clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
  }
  65% {
    -webkit-clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
    clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
  }
  70% {
    -webkit-clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
    clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
  }
  75% {
    -webkit-clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
    clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
  }
  80% {
    -webkit-clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
    clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
  }
  85% {
    -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
    clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
  }
  90% {
    -webkit-clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
    clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
  }
  95% {
    -webkit-clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
  }
  100% {
    -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
    clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
  }
`;

const glitchFlash = keyframes`
  50% { 
    opacity: 0.5; 
    transform: translate3d(-10%, -10%, 0);
  }
  0%, 60%, 100% { 
    opacity: 0;
    transform: none;
  }
`;

const Wrap = styled.div``;

const Glitch = styled.div`
  @supports (
    (clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%)) or
      (-webkit-clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%))
  ) {
    position: absolute;
    top: -40px;
    left: -40px;
    width: calc(100% + 80px);
    height: calc(100% + 80px);
    background: url(${(p) => p.src}) no-repeat 50% 0;
    background-size: cover;
    background-blend-mode: multiply;
    transform: translate3d(40px, 0, 0);
    animation: ${glitchHorizontal} 1s infinite linear alternate;
  }
`;

const GlitchBlink = styled.div`
  @supports (
    (clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%)) or
      (-webkit-clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%))
  ) {
    position: absolute;
    top: 0;
    left: 0;
    width: 110%;
    height: 110%;
    background: url(${(p) => p.src}) no-repeat 50% 0;
    background-size: cover;
    background-blend-mode: multiply;
    animation: ${glitchFlash} 2s steps(1, end) infinite;
  }
`;

const GlitchImage = ({ className, src }) => (
  <Wrap className={className}>
    <Glitch src={src} />
    <GlitchBlink src={src} />
  </Wrap>
);

export default GlitchImage;
