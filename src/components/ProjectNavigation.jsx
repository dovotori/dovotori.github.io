import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import BackArrow from 'Assets/svg/arrow.svg';

const Wrap = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 800px;
  z-index: 1;
`;

const LINK = styled(Link)`
  position: relative;
  width: 33.3333%;
  padding: 1.5em 0 1.5em 2%;
  color: ${(p) => p.theme.getColor};
  ${(p) => p.theme.active};
  transition: background-color 1000ms ease-out, color 1000ms ease-out;
  background-color: none;
  float: left;
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

const Arrow = styled(BackArrow)`
  height: 1em;
  fill: ${(p) => p.theme.getColor};
`;

const NextArrow = styled(Arrow)`
  transform: rotate(180deg);
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

const ProjectNavigation = ({ prevEntry, nextEntry, colorType }) => (
  <Wrap>
    <LINK colorType={colorType} to="/">
      <Arrow colorType={colorType} />
      <Arrow colorType={colorType} />
      <Span>Back</Span>
    </LINK>
    <LINK colorType={colorType} to={`/project/${prevEntry.slug}`}>
      <Arrow colorType={colorType} />
      <Span>{prevEntry.title}</Span>
    </LINK>
    <LINK colorType={colorType} to={`/project/${nextEntry.slug}`}>
      <NextArrow colorType={colorType} />
      <Span>{nextEntry.title}</Span>
    </LINK>
  </Wrap>
);

export default ProjectNavigation;
