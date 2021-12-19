import { useCallback, useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 35%, 65%, 100% {
    transform: none;
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.05);
  }
  75% {
    transform: scale(1.02);
  }
`;
const Circle = styled.svg`
  position: absolute;
  width: 320px;
  height: 320px;
  max-width: 100%;
  max-height: 100%;
  top: calc(50% - 160px);
  left: calc(50% - 160px);
  fill: ${(p) => p.theme.midl};
  transform-origin: center center;
`;

const CircleAnim = styled(Circle)`
  fill: ${(p) => p.theme.primary};
  opacity: 0.7;
  &.go {
    animation: ${pulse} 400ms ${(p) => p.theme.elastic};
  }
`;

const Pulse = ({ count }) => {
  const [isModeTransition, setIsModeTransition] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (count) {
      setIsModeTransition(true);
    }
  }, [count]);

  const reset = useCallback(() => {
    setIsModeTransition(false);
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('animationend', reset, false);
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('animationend', reset, false);
      }
    };
  }, []);

  return (
    <>
      <CircleAnim ref={ref} className={isModeTransition ? 'go' : ''} viewBox="0 0 4 4">
        <path d="M0 2 L2 0 L4 2 L2 4Z" />
      </CircleAnim>
      <Circle viewBox="0 0 4 4">
        <path d="M0 2 L2 0 L4 2 L2 4Z" />
      </Circle>
    </>
  );
};

export default Pulse;
