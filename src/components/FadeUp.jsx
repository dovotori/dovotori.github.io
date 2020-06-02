import React, { Children } from "react";
import styled, { keyframes } from "styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const duration = 1000;

const fadeUp = keyframes`
  0% { transform: translate3d(0, 200px, 0); opacity: 0; }
  100% { transform: none; opacity: 1; }
`;

const StyledCSSTransition = styled(CSSTransition)`
  &.fade-appear {
    opacity: 0;
    animation: ${fadeUp} ${duration}ms ${(p) => p.theme.elastic}
      ${(p) => p.delay}ms forwards;
  }
`;

const FadeUp = ({ children }) => (
  <TransitionGroup appear>
    {Children.map(children, (child, idx) => (
      <StyledCSSTransition
        delay={idx * 300}
        key={child.key}
        timeout={duration + idx * 300}
        classNames="fade"
      >
        {child}
      </StyledCSSTransition>
    ))}
  </TransitionGroup>
);

export default FadeUp;
