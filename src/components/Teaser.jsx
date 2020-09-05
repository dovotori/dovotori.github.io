import React, { useEffect, useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import { ReactComponent as PlusIcon } from 'Assets/svg/plus.svg';
import LazyImage from './LazyImage';
import { getTeaserPath, getColorType } from '../utils';
import Loader from './Loader';

const StyledLink = styled(Link).attrs({
  className: 'teaser',
})`
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin: 1em;
  width: 400px;
  height: 150px;
  opacity: ${(p) => p.levelOpacity};
  box-shadow: 0 0 1em ${(p) => p.theme.backgroundHighlight};
  transform: ${(p) => {
    if (p.isVisible) {
      return p.isHovered && !p.isTouchDevice ? 'scale(1.2)' : 'none';
    }
    return 'translateY(20%)';
  }};
  z-index: ${(p) => (p.isVisible && p.isHovered && !p.isTouchDevice ? 1 : 0)};
  transition: opacity 1s ${(p) => p.theme.elastic}, transform 1s ${(p) => p.theme.elastic};

  ${(p) => p.theme.active}
  ${(p) => p.theme.media.mobile`margin: 1em auto; width: 100%; height: auto;`}
`;

const StyledLazyImage = styled(LazyImage)`
  width: 100%;
  transform: ${(p) => (p.isFocus ? 'scale(1.1)' : 'none')};
  transition: transform 5000ms ${(p) => p.theme.elastic};
  height: 100%;
  img {
    width: 100%;
    height: auto;
    display: block;
    opacity: 0.8;
  }
`;

const Infos = styled.div`
  overflow: hidden;
  background: ${(p) => p.theme.getGradient};
  height: 100%;
`;

const Plus = styled(PlusIcon)`
  position: absolute;
  top: 25%;
  left: 5%;
  width: auto;
  height: 50%;
  fill: ${(p) => p.theme.getColor};
  opacity: ${(p) => (p.isFocus ? 1 : 0)};
  transition: opacity 1000ms ${(p) => p.theme.elastic};
`;

const WrapLoader = styled.div`
  margin: 20px auto;
`;

const Teaser = ({ entry, className, currentHover, setCurrentHover, isTouchDevice }) => {
  const { category, slug, title } = entry;
  const colorType = getColorType(category);
  const [isHovered, setIsHovered] = useState(false);
  const [refInView, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const onEnter = useCallback(() => setIsHovered(true), [setIsHovered]);
  const onLeave = useCallback(() => setIsHovered(false), [setIsHovered]);
  useEffect(() => setCurrentHover(isHovered ? slug : ''), [isHovered]);

  const opacity = useMemo(() => {
    if (!inView) {
      return 0;
    }
    if (isTouchDevice || currentHover === slug || currentHover === '') {
      return 1;
    }
    return 0.65;
  }, [currentHover, isHovered, inView]);

  return (
    <StyledLink
      ref={refInView}
      className={className}
      to={`/project/${slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      levelOpacity={opacity}
      isVisible={inView}
      title={slug}
      isHovered={isHovered}
      isTouchDevice={isTouchDevice}
    >
      <Infos colorType={colorType}>
        <StyledLazyImage
          src={getTeaserPath(slug)}
          alt={title}
          width={400}
          height={150}
          withGlitch={isHovered}
          isFocus={isHovered}
        >
          <WrapLoader>
            <Loader colorType={colorType} />
          </WrapLoader>
        </StyledLazyImage>
      </Infos>
      <Plus isFocus={isHovered} colorType={colorType} />
    </StyledLink>
  );
};

export default Teaser;
