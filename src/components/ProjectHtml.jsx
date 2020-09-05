import React, { useCallback, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

import Html from './Html';
import Loader from './Loader';

const loadTransition = keyframes`
  0% { transform: none; }
  100% { transform: translate3d(0, 100%, 0); }
`;

const Wrap = styled.div`
  position: relative;
  margin: 0 auto 10vh;
  min-height: 100px;
  max-width: 1024px;
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

const StyledHtml = styled(Html)`
  canvas {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: auto;
    max-height: 100vh;
  }
`;

const ProjectHtml = (props) => {
  const { colorType, className, slug, noBackground } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const onHtmlLoad = useCallback(() => {
    setIsLoaded(true);
  }, [setIsLoaded]);

  useEffect(() => {
    setIsLoaded(false);
  }, [slug]);

  return (
    <Wrap className={className}>
      <StyledHtml slug={slug} onLoad={onHtmlLoad} />
      {!noBackground && <LoadedTransition colorType={colorType} isLoaded={isLoaded} />}
      {!isLoaded && <Loader colorType={colorType} className={`loader${slug}`} />}
    </Wrap>
  );
};

export default ProjectHtml;
