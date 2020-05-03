import styled, { css } from "styled-components";
import { glitchy } from "./animations";

export const Title = styled.h1`
  text-align: left;
  font-size: 4em;
  font-family: "matamata", monospace;
  font-weight: 500;
  letter-spacing: 0.2em;
  line-height: 1.1;
  color: ${(p) => p.theme.getColor};
  overflow-wrap: break-word;
`;

export const withHoverGlitch = css`
  &:hover {
    &:before,
    &:after {
      content: "";
    }

    &:before {
      animation: ${glitchy} 0.3s ease 0.3s infinite;
    }
    &:after {
      animation: ${glitchy} 0.3s ease infinite reverse;
    }
  }

  &:before,
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 4px;
  }
  &:before {
    background-color: ${(p) => p.theme.getColor};
    z-index: -1;
    opacity: 0.6;
  }
  &:after {
    background-color: ${(p) => p.theme.getColor};
    z-index: -2;
    opacity: 0.3;
  }
`;

export const withTextGlitch = css`
  position: relative;
  z-index: 1;
  &:before,
  &:after {
    content: attr(data-content);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:before {
    color: #00ffff;
    z-index: -1;
  }

  &:after {
    color: #ff00ff;
    z-index: -2;
  }

  &:hover {
    &:before {
      animation: ${glitchy} 0.3s ease 0.3s infinite;
    }

    &:after {
      animation: ${glitchy} 0.3s ease infinite reverse;
    }
  }
`;

export const Overline = styled.span`
  font-family: ${(p) => p.theme.font2};
  font-size: 0.8em;
  letter-spacing: 2px;
  padding: 0 4px;
`;
