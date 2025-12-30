import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { css, keyframes } from "styled-components";

import Toggle from "./Toggle";

const loadTransition = keyframes`
  0% { transform: translate3d(-50%, -50%, 0) scale(0); }
  100% { transform: translate3d(-50%, -50%, 0); }
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: isModeTransition
  useEffect(() => {
    const el = refTransition.current;
    if (el) {
      el.addEventListener("animationend", reset, false);
    }
    return () => {
      if (el) {
        el.removeEventListener("animationend", reset, false);
      }
    };
  }, [reset, isModeTransition]);

  return (
    <>
      <Toggle
        id={toggleId}
        onClick={onClick}
        checked={isDarkMode}
        label={isDarkMode ? texts.lightMode : texts.darkMode}
      />
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
