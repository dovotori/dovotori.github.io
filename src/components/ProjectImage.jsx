import React from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

import LazyImage from './LazyImage';
import Loader from './Loader';
import { getProjectImagePath } from '../utils';

const StyledLazyImage = styled(LazyImage)`
  margin: 0 auto 10vh;
  min-height: 100px;
  background: ${(p) => p.theme.getGradient};
  box-shadow: 0 0 4em ${(p) => p.theme.backgroundHighlight};
  opacity: ${(p) => (p.isVisible ? 1 : 0)};
  transform: ${(p) => (p.isVisible ? 'none' : 'translateY(20%)')};
  transition: opacity 1s ${(p) => p.theme.elastic}, transform 1s ${(p) => p.theme.elastic};
`;

const ProjectImage = ({ slug, colorType, idx, className }) => {
  const [refInView, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });
  return (
    <StyledLazyImage
      ref={refInView}
      colorType={colorType}
      src={getProjectImagePath(slug, idx)}
      className={className}
      isVisible={inView}
    >
      <Loader colorType={colorType} />
    </StyledLazyImage>
  );
};

export default ProjectImage;
