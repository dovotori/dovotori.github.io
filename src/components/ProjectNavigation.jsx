import React from 'react';
import styled from 'styled-components';

import { ReactComponent as BackArrow } from 'Assets/svg/arrow.svg';
import ButtonNavigation from './ButtonNavigation';

const Wrap = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 800px;
  z-index: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Arrow = styled(BackArrow)`
  height: 1em;
  fill: ${(p) => p.theme.getColor};
`;

const NextArrow = styled(Arrow)`
  transform: rotate(180deg);
`;

const ProjectNavigation = ({
  prevEntry,
  nextEntry,
  $colorType,
  labelBack,
  labelPrevious,
  labelNext,
}) => (
  <Wrap>
    <ButtonNavigation $colorType={$colorType} to="/" label={labelBack}>
      <Arrow $colorType={$colorType} />
      <Arrow $colorType={$colorType} />
    </ButtonNavigation>
    <ButtonNavigation
      $colorType={$colorType}
      to={`/project/${prevEntry.slug}`}
      label={prevEntry.title !== '' ? prevEntry.title : labelPrevious}
    >
      <Arrow $colorType={$colorType} />
    </ButtonNavigation>
    <ButtonNavigation
      $colorType={$colorType}
      to={`/project/${nextEntry.slug}`}
      label={nextEntry.title !== '' ? nextEntry.title : labelNext}
    >
      <NextArrow $colorType={$colorType} />
    </ButtonNavigation>
  </Wrap>
);

export default ProjectNavigation;
