import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  position: relative;
  width: 100%;
  padding: 1.5em 0 1.5em 2%;
  color: ${(p) => p.theme.getColor};
  ${(p) => p.theme.active};
  transition:
    background-color 1000ms ease-out,
    color 1000ms ease-out;
  background-color: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow-wrap: break-word;
  overflow: hidden;
  opacity: 0.5;

  &:focus {
    color: ${(p) => p.theme.getColor};
  }

  &:hover {
    background-color: ${(p) => p.theme.backgroundHighlight};
    opacity: 1;

    span {
      opacity: 1;
    }
  }
  ${(p) => p.theme.media.mobile`
    justify-content: center;
  `}
`;

const Span = styled.span`
  transition: opacity 1000ms ease-out;
  opacity: 0;
  margin: 0 0 0 1em;
  ${(p) => p.theme.monospace}
  ${(p) => p.theme.media.mobile`
    display: none;
  `}
`;

const ButtonNavigation = ({ children, className, to, $colorType, label }) => (
  <StyledLink className={className} $colorType={$colorType} to={to}>
    {children}
    <Span>{label}</Span>
  </StyledLink>
);

export default ButtonNavigation;
