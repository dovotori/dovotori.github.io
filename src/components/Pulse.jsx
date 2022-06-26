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
const Circle = styled.div`
  position: absolute;
  width: 240px;
  height: 240px;
  top: calc(50% - 120px);
  left: calc(50% - 120px);
  background: ${(p) => p.theme.backgroundHighlight};
  background: linear-gradient(to right, #222, #333);
  transform-origin: center center;
  border-radius: 50%;
`;

const CircleAnim = styled(Circle)`
  background: ${(p) => p.theme.primary};
  opacity: 0.7;
  transform: scale(0.5);
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
      <CircleAnim ref={ref} className={isModeTransition ? 'go' : ''}>
        {/* <path d="M0 2 L2 0 L4 2 L2 4Z" /> */}
      </CircleAnim>
      <Circle>
        {/* <path d="M0 2 L2 0 L4 2 L2 4Z" /> */}
      </Circle>
    </>
  );
};

export default Pulse;
