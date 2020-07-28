import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import useHover from '../hooks/useHover';

const common = css`
  position: relative;
  display: flex;
  width: 100%;
  margin: 2em auto;
  padding: 1em 10px;
  background-color: ${(p) => p.theme.getColor};
  border: solid 1px ${(p) => p.theme.backgroundHighlight};
  box-shadow: 2px 2px 0 ${(p) => p.theme.backgroundHighlight};
  max-width: 400px;
  -webkit-tap-highlight-color: ${(p) => p.theme.backgroundHighlight};
  ${(p) => p.theme.active}
  justify-content: flex-end;
`;

const LINK = styled(Link)`
  ${common}
`;

const A = styled.a`
  ${common}
`;

const Fill = styled.div`
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: 0;
  background: ${(p) => p.theme.getGradient};
  transition: transform 300ms ${(p) => p.theme.elastic};
  transform-origin: 100% 0;
  transform: ${(p) => (p.isFocus ? 'none' : 'scale(0, 1)')};
`;

const Span = styled.span`
  position: relative;
  z-index: 1;
  display: inline-block;
  color: ${(p) => p.theme.background};
  font-size: 0.8em;
  ${(p) => p.theme.monospace}
`;

const Button = ({ to, className, href, colorType, text }) => {
  const [hoverRef, isHovered] = useHover();
  const Component = href ? A : LINK;
  return (
    <Component
      href={href}
      to={to || '/'}
      className={className}
      isFocus={isHovered}
      colorType={colorType}
      ref={hoverRef}
    >
      <Fill isFocus={isHovered} />
      <Span colorType={colorType}>{text}</Span>
    </Component>
  );
};

export default Button;
