import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { css, keyframes } from "styled-components";

import Toggle from "./Toggle";

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

const Span = styled.label`
  ${commonItem}
  color: ${(p) => (p.isHighlight ? p.theme.primary : p.theme.light)};
`;

const animationLoad = css`
  animation: ${loadTransition} 800ms linear forwards;
`;

const TransitionEffect = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: ${(p) => (p.$isDarkMode ? "#fff" : "#222")};
`;

const Circle = styled.div`
  position: absolute;
  top: calc(100% - 2em);
  left: 50%;
  width: 250vh;
  height: 250vh;
  background-color: ${(p) => p.theme.background};
  transform-origin: center center;
  ${animationLoad}
`;

const ToggleMode = ({ isDarkMode, toggleTheme, texts }) => {
  const [isModeTransition, setIsModeTransition] = useState(false);
  const refTransition = useRef(null);
  const uid = useId();
  const toggleId = `themeMode-${uid}`;

  const reset = useCallback(() => {
    setIsModeTransition(false);
  }, []);

  const onClick = useCallback(() => {
    toggleTheme();
    setIsModeTransition(true);
  }, [toggleTheme]);

  useEffect(() => {
    if (refTransition.current) {
      refTransition.current.addEventListener("animationend", reset, false);
    }
    return () => {
      if (refTransition.current) {
        refTransition.current.removeEventListener("animationend", reset, false);
      }
    };
  }, [reset]);

  return (
    <>
      <Toggle id={toggleId} onClick={onClick} checked={isDarkMode} />
      <Span htmlFor={toggleId}>
        {isDarkMode ? texts.lightMode : texts.darkMode}
      </Span>
      {isModeTransition &&
        createPortal(
          <TransitionEffect $isDarkMode={isDarkMode}>
            <Circle ref={refTransition} />
          </TransitionEffect>,
          document.body,
        )}
    </>
  );
};

export default ToggleMode;
