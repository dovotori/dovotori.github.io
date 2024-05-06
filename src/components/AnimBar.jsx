import styled, { keyframes } from "styled-components";

const move = keyframes`
  0% {
    transform: scale(0.9,1);
  }
  25%, 75% {
    transform: scale(0.8,1);
  }
  50% {
    transform: scale(0.85,1);
  }
  100% {
    transform: none;
  }
`;

const Bar = styled.div`
  width: 100%;
  height: 1px;
  background: ${(p) => p.theme.getGradient};
  transform-origin: left center;
  animation: ${move} 30s ${(p) => p.theme.elastic} alternate-reverse infinite;
`;

export default Bar;
