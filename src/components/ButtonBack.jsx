import { ReactComponent as BackArrow } from "Assets/svg/arrow.svg";
import { Link } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import useHover from "../hooks/useHover";

const moveLeft = keyframes`
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: none;
    opacity: 1;
  }
`;

const LINK = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 2em auto;
  padding: 0.5em;
  min-height: 40px;
  border: solid 1px ${(p) => p.theme.getColor};
  box-shadow: 2px 2px 0 ${(p) => p.theme.getColor};
  max-width: 400px;
  -webkit-tap-highlight-color: ${(p) => p.theme.getColor};
  overflow: hidden;

  ${(p) => p.theme.active}

  background: ${(p) => (p.$isFocus ? p.theme.softGradient : "transparent")};
`;

const ArrowsContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const AnimatedArrow = styled(BackArrow)`
  position: absolute;
  fill: ${(p) => p.theme.getColor};
  height: 0.6em;
  opacity: 0;
  margin-left: ${(p) => p.$delay * 0.1}px;
  
  ${(p) =>
    p.$isAnimating &&
    css`
      animation: ${moveLeft} 400ms ease-in-out forwards;
      animation-delay: ${(p) => p.$delay}ms;
    `}
`;

const Span = styled.span`
  width: 100%;
  color: ${(p) => p.theme.getColor};
  ${(p) => p.theme.monospace}
  font-size: 0.8em;
  letter-spacing: 0.5em;
  text-align: right;
`;

const ARROW_DELAYS = [0, 100, 200, 300, 400];

const ButtonBack = ({ to, className, $colorType, label }) => {
  const [hoverRef, isHovered] = useHover();

  return (
    <LINK
      to={to || "/"}
      className={className}
      $isFocus={isHovered}
      $colorType={$colorType}
      ref={hoverRef}
    >
      <ArrowsContainer>
        {isHovered &&
          ARROW_DELAYS.map((delay) => (
            <AnimatedArrow
              key={delay}
              $colorType={$colorType}
              $isAnimating={isHovered}
              $delay={delay}
            />
          ))}
      </ArrowsContainer>
      <Span $colorType={$colorType}>{label}</Span>
    </LINK>
  );
};

export default ButtonBack;
