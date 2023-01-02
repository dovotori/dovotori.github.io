import { useCallback, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

import Labo from './Labo';
import Loader from './Loader';

const loadTransition = keyframes`
  0% { transform: none; }
  100% { transform: scale(1, 0); }
`;

const Wrap = styled.div`
  position: relative;
  margin: 0 auto 10vh;
  max-width: 1024px;
  min-height: 400px;
  text-align: left;
  color: ${(p) => p.theme.light};
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    margin: 1em auto;
    box-shadow: 0 0 1em ${(p) => p.theme.backgroundHighlight};
  }
`;

const animationLoad = css`
  animation: ${loadTransition} 600ms ${(p) => p.theme.elastic} forwards;
`;

const LoadedTransition = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(p) => p.theme.getGradient};
  transform-origin: center 100%;
  ${(p) => (p.isLoaded ? animationLoad : '')};
`;

const StyledLabo = styled(Labo)`
  width: 100%;
  height: auto;

  canvas {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: auto;
  }

  :fullscreen {
    canvas {
      width: auto;
    }
  }
`;

const ProjecLabo = (props) => {
  const { colorType, className, slug, noBackground, hasJs = false, hasHtml = false } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = useCallback(() => {
    setIsLoaded(true);
  }, [setIsLoaded]);

  useEffect(() => {
    setIsLoaded(false);
  }, [slug]);

  return (
    <Wrap className={className}>
      <StyledLabo slug={slug} onLoad={onLoad} hasHtml={hasHtml} hasJs={hasJs} />
      {!noBackground && <LoadedTransition $colorType={colorType} isLoaded={isLoaded} />}
      {!isLoaded && <Loader $colorType={colorType} />}
    </Wrap>
  );
};

export default ProjecLabo;
