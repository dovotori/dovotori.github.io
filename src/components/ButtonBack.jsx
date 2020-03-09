import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';

import BackArrow from 'Assets/svg/arrow.svg';
import useHover from '../hooks/useHover';

const LINK = styled(Link)`
  position: relative;
  display: flex;
  width: calc(100% - 20px);
  margin: 2em auto;
  padding: 1em 10px;
  background-color: ${(p) => (p.isFocus ? p.theme.backgroundHighlight : p.theme.background)};
  transition: background-color 200ms ease-out;
  border: solid 1px ${(p) => p.theme.getColor};
  box-shadow: 2px 2px 0 ${(p) => p.theme.getColor};
  max-width: 400px;
  -webkit-tap-highlight-color: ${(p) => p.theme.getColor};

  ${(p) => p.theme.active}
`;

const StyledBackArrow = styled(BackArrow)`
  position: relative;
  fill: ${(p) => p.theme.getColor};
  width: auto;
  height: 0.6em;
  margin: 0 0.2em;
`;

const Fill = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: transform 300ms ${(p) => p.theme.elastic};
  background: ${(p) => p.theme.backgroundHighlight};
  transform-origin: 100% 0;
  transform: ${(p) => (p.isFocus ? 'none' : 'scale(0, 1)')};
`;

const Span = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate3d(0, -50%, 0);
  display: inline-block;
  color: ${(p) => p.theme.getColor};
  ${(p) => p.theme.monospace}
`;

const ButtonBack = ({
  to, className, colorType, text,
}) => {
  const [hoverRef, isHovered] = useHover();
  return (
    <LINK
      to={to || '/'}
      className={className}
      isFocus={isHovered}
      colorType={colorType}
      ref={hoverRef}
    >
      <Fill isFocus={isHovered} />
      <StyledBackArrow colorType={colorType} />
      <Span colorType={colorType}>{text}</Span>
    </LINK>
  );
};

export default connect((state) => ({ text: state.content.back }))(ButtonBack);
