import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { createPortal } from 'react-dom';

import Toggle from './Toggle';

const loadTransition = keyframes`
  0% { transform: translate3d(-50%, -50%, 0) scale(0); }
  100% { transform: translate3d(-50%, -50%, 0); }
`;

const commonItem = css`
  position: relative;
  padding: 0.4em;
  margin: 0 1em;
  text-transform: uppercase;
  text-align: center;
  min-width: 70px;
  ${(p) => p.theme.monospace}
  font-weight: normal;
`;

const Span = styled.span`
  ${commonItem}
  color: ${(p) => (p.isHighlight ? p.theme.primary : p.theme.light)};
`;

const animationLoad = css`
  animation: ${loadTransition} 300ms linear forwards;
`;

const TransitionEffect = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: ${(p) => (p.isDarkMode ? '#fff' : '#222')};
`;

const Circle = styled.div`
  position: absolute;
  top: calc(100% - 2em);
  left: 50%;
  width: 250vh;
  height: 250vh;
  border-radius: 50%;
  background-color: ${(p) => p.theme.background};
  transform-origin: center center;
  ${animationLoad}
`;

const ToggleMode = ({ isDarkMode, toggleTheme, texts }) => {
  const [nextMode, setNextMode] = useState(isDarkMode);
  const [isModeTransition, setIsModeTransition] = useState(false);
  const refTransition = useRef(null);

  const reset = useCallback(() => {
    setIsModeTransition(false);
  }, []);

  const onClick = useCallback(() => {
    toggleTheme();
    setIsModeTransition(true);
    setNextMode(!isDarkMode);
  }, [nextMode, isDarkMode]);

  useEffect(() => {
    if (refTransition.current) {
      refTransition.current.addEventListener('animationend', reset, false);
    }
    return () => {
      if (refTransition.current) {
        refTransition.current.removeEventListener('animationend', reset, false);
      }
    };
  }, [isModeTransition]);

  return (
    <>
      <Toggle id="themeMode" onClick={onClick} checked={isDarkMode} />
      <Span>{isDarkMode ? texts.lightMode : texts.darkMode}</Span>
      {isModeTransition &&
        createPortal(
          <TransitionEffect isDarkMode={isDarkMode}>
            <Circle ref={refTransition} />
          </TransitionEffect>,
          document.body
        )}
    </>
  );
};

export default ToggleMode;
