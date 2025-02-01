import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

import { getProjectImagePath } from '../utils';
import LazyImage from './LazyImage';
import Loader from './Loader';

const StyledLazyImage = styled(LazyImage)`
  margin: 0 auto 10vh;
  min-height: 100px;
  background: ${(p) => p.theme.getGradient};
  box-shadow: 0 0 2em ${(p) => p.theme.backgroundHighlight};
  opacity: ${(p) => (p.$isVisible ? 1 : 0)};
  transform: ${(p) => (p.$isVisible ? 'none' : 'translateY(20%)')};
  border-radius: 0.4em;
  transition:
    opacity 1s ${(p) => p.theme.elastic},
    transform 1s ${(p) => p.theme.elastic},
    box-shadow 800ms linear;
`;

const ProjectImage = ({ slug, $colorType, idx, className }) => {
  const [refInView, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });
  return (
    <StyledLazyImage
      ref={refInView}
      $colorType={$colorType}
      src={getProjectImagePath(slug, idx)}
      className={className}
      $isVisible={inView}
    >
      <Loader $colorType={$colorType} />
    </StyledLazyImage>
  );
};

export default ProjectImage;
